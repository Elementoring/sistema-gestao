"""
Script para gerar ícone do aplicativo usando a logo fornecida
"""
try:
    from PIL import Image
    import os
    
    print("🎨 Gerando ícone do aplicativo...")
    
    # Criar pasta assets se não existir
    os.makedirs('desktop/assets', exist_ok=True)
    
    # Verificar se a logo existe
    logo_path = 'desktop/assets/logo.png'
    if not os.path.exists(logo_path):
        print(f"❌ Logo não encontrada em: {logo_path}")
        print("Por favor, certifique-se de que LOGO.png foi copiado para desktop/assets/")
        exit(1)
    
    # Abrir a logo original
    logo = Image.open(logo_path)
    print(f"✅ Logo carregada: {logo.size}")
    
    # Redimensionar para 512x512 mantendo aspecto
    size = 512
    logo.thumbnail((size, size), Image.Resampling.LANCZOS)
    
    # Criar imagem final com fundo branco
    icon = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    
    # Centralizar a logo
    offset_x = (size - logo.size[0]) // 2
    offset_y = (size - logo.size[1]) // 2
    icon.paste(logo, (offset_x, offset_y), logo if logo.mode == 'RGBA' else None)
    
    # Salvar como PNG
    png_path = 'desktop/assets/icon.png'
    icon.save(png_path, 'PNG')
    print(f"✅ PNG criado: {png_path}")
    
    # Converter para ICO com múltiplos tamanhos
    icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    ico_path = 'desktop/assets/icon.ico'
    icon.save(ico_path, format='ICO', sizes=icon_sizes)
    print(f"✅ ICO criado: {ico_path}")
    
    print("\n🎉 Ícone gerado com sucesso!")
    
except ImportError:
    print("❌ Pillow não está instalado!")
    print("📥 Instalando Pillow...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'pillow'])
    print("✅ Pillow instalado! Execute o script novamente.")
except Exception as e:
    print(f"❌ Erro ao gerar ícone: {e}")
    print("\n⚠️  Você precisará adicionar um ícone manualmente.")
    print("   Veja: desktop/assets/README.md")
