import subprocess
import os
import sys

def run_command(cmd, cwd=None):
    """Execute command and show output"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            check=True,
            text=True,
            capture_output=False
        )
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n[ERRO] Comando falhou: {e}")
        return False

def main():
    print("=" * 50)
    print("  Cred Management+ - Build Desktop App")
    print("=" * 50)
    print()
    
    # Pasta do projeto desktop
    desktop_dir = os.path.join(os.path.dirname(__file__), 'desktop')
    
    print("[1/2] Compilando TypeScript...")
    if not run_command('npm run build', cwd=desktop_dir):
        print("\n[ERRO] Falha na compilacao!")
        input("Pressione Enter para sair...")
        sys.exit(1)
    
    print("\n[2/2] Gerando instalador Windows...")
    print("(Isso pode levar 3-5 minutos, aguarde...)\n")
    
    if not run_command('npx electron-builder --win --config.win.signAndEditExecutable=false', cwd=desktop_dir):
        print("\n[ERRO] Falha ao gerar instalador!")
        input("Pressione Enter para sair...")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("  [OK] BUILD CONCLUIDO COM SUCESSO!")
    print("=" * 50)
    print("\nInstalador gerado em:")
    print("  desktop\\release\\Cred Management+-Setup-1.0.0.exe")
    print()
    
    # Abre a pasta do instalador
    release_dir = os.path.join(desktop_dir, 'release')
    if os.path.exists(release_dir):
        os.startfile(release_dir)
    
    input("\nPressione Enter para sair...")

if __name__ == '__main__':
    main()
