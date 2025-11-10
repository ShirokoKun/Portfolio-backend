import argparse
import os
import platform
import shutil
import subprocess
import sys
import time
from pathlib import Path


def kill_port(port: int) -> bool:
    """Kill any process running on the specified port."""
    system = platform.system()
    
    try:
        if system == "Windows":
            # Find process using the port
            result = subprocess.run(
                ["netstat", "-ano"],
                capture_output=True,
                text=True,
                check=False,
            )
            for line in result.stdout.splitlines():
                if f":{port}" in line and "LISTENING" in line:
                    parts = line.split()
                    if len(parts) > 0:
                        pid = parts[-1]
                        try:
                            subprocess.run(
                                ["taskkill", "/F", "/PID", pid],
                                capture_output=True,
                                check=False,
                            )
                            print(f"Killed process {pid} on port {port}")
                            time.sleep(0.5)  # Give it time to release the port
                        except Exception:
                            pass
        else:
            # Unix-like systems (Linux, macOS)
            result = subprocess.run(
                ["lsof", "-ti", f":{port}"],
                capture_output=True,
                text=True,
                check=False,
            )
            if result.stdout.strip():
                pids = result.stdout.strip().split("\n")
                for pid in pids:
                    if pid:
                        try:
                            subprocess.run(
                                ["kill", "-9", pid],
                                capture_output=True,
                                check=False,
                            )
                            print(f"Killed process {pid} on port {port}")
                            time.sleep(0.5)
                        except Exception:
                            pass
        return True
    except Exception as e:
        print(f"Warning: Could not kill process on port {port}: {e}", file=sys.stderr)
        return False


def clean_build_cache(project_root: Path) -> None:
    """Clean Next.js build cache if it exists."""
    next_dir = project_root / ".next"
    if next_dir.exists():
        try:
            print("Cleaning .next build cache...")
            shutil.rmtree(next_dir)
            print("Build cache cleaned successfully.")
        except Exception as e:
            print(f"Warning: Could not clean .next directory: {e}", file=sys.stderr)


def main() -> int:
    project_root = Path(__file__).resolve().parent

    parser = argparse.ArgumentParser(description="Start Next.js dev server")
    parser.add_argument("--port", "-p", type=int, default=3000, help="Port to run the dev server on")
    parser.add_argument(
        "--package-manager",
        "-m",
        choices=["npm", "yarn", "pnpm", "bun"],
        default="npm",
        help="Package manager to use",
    )

    args = parser.parse_args()

    env = os.environ.copy()

    # Detect preferred package manager based on lockfiles and availability
    lockfile_preference = [
        ("pnpm", project_root / "pnpm-lock.yaml"),
        ("yarn", project_root / "yarn.lock"),
        ("bun", project_root / "bun.lockb"),
        ("npm", project_root / "package-lock.json"),
    ]

    def which_any(names: list[str]) -> str | None:
        for name in names:
            found = shutil.which(name)
            if found:
                return found
        return None

    def resolve_package_manager(user_choice: str | None) -> tuple[str, str] | None:
        # Try explicit user choice first
        if user_choice:
            mapping = {
                "npm": ["npm", "npm.cmd", "npm.exe"],
                "yarn": ["yarn", "yarn.cmd", "yarn.exe"],
                "pnpm": ["pnpm", "pnpm.cmd", "pnpm.exe"],
                "bun": ["bun", "bun.cmd", "bun.exe"],
            }
            found = which_any(mapping[user_choice])
            if found:
                return user_choice, found
            # fallthrough to auto if not found

        # Next, prefer based on lockfiles
        for manager, lockfile in lockfile_preference:
            if lockfile.exists():
                found = which_any([f"{manager}", f"{manager}.cmd", f"{manager}.exe"])
                if found:
                    return manager, found

        # Finally, pick the first available
        for manager in ["pnpm", "yarn", "bun", "npm"]:
            found = which_any([f"{manager}", f"{manager}.cmd", f"{manager}.exe"])
            if found:
                return manager, found

        return None

    resolved = resolve_package_manager(args.package_manager)
    if not resolved:
        print(
            "No supported package manager found (npm, yarn, pnpm, bun). Install one and try again.",
            file=sys.stderr,
        )
        return 1

    manager_name, manager_path = resolved

    # Kill any existing process on the port
    print(f"Checking for existing processes on port {args.port}...")
    kill_port(args.port)
    time.sleep(1)  # Wait a bit for port to be released

    # Clean build cache to avoid stale builds
    clean_build_cache(project_root)

    def run(cmd: list[str]) -> int:
        try:
            proc = subprocess.Popen(cmd, cwd=project_root, env=env)
            proc.wait()
            return proc.returncode
        except FileNotFoundError:
            print(f"Error: '{cmd[0]}' not found on PATH.", file=sys.stderr)
            return 1

    # Install dependencies if node_modules missing
    node_modules_dir = project_root / "node_modules"
    if not node_modules_dir.exists():
        print(f"Installing dependencies with {manager_name}...")
        if manager_name == "npm":
            code = run([manager_path, "install", "--no-fund", "--no-audit"])
        elif manager_name == "yarn":
            code = run([manager_path, "install"])
        elif manager_name == "pnpm":
            code = run([manager_path, "install"])
        else:  # bun
            code = run([manager_path, "install"])
        if code != 0:
            return code

    # Build the dev command
    if manager_name == "npm":
        cmd = [manager_path, "run", "dev", "--", "-p", str(args.port)]
    elif manager_name == "yarn":
        cmd = [manager_path, "dev", "-p", str(args.port)]
    elif manager_name == "pnpm":
        cmd = [manager_path, "dev", "-p", str(args.port)]
    else:  # bun
        cmd = [manager_path, "run", "dev", "-p", str(args.port)]

    print(f"Starting Next.js dev server on http://localhost:{args.port} using {manager_name}...")
    try:
        process = subprocess.Popen(cmd, cwd=project_root, env=env)
        process.wait()
        return process.returncode
    except KeyboardInterrupt:
        try:
            process.terminate()
        except Exception:
            pass
        return 130


if __name__ == "__main__":
    raise SystemExit(main())


