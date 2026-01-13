"""
Script para gerar um ícone simples para o aplicativo desktop
"""
try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    # Criar uma imagem 512x512 com fundo gradiente azul
    size = 512
    img = Image.new('RGB', (size, size), color='#1e40af')
    draw = ImageDraw.Draw(img)
    
    # Criar um círculo branco no centro
    circle_margin = 80
    draw.ellipse(
        [circle_margin, circle_margin, size - circle_margin, size - circle_margin],
        fill='white',
        outline='#3b82f6',
        width=15
    )
    
    # Adicionar texto "CM+"
    try:
        # Tentar usar uma fonte do sistema
        font = ImageFont.truetype("arial.ttf", 180)
    except:
        # Se não encontrar, usar fonte padrão
        font = ImageFont.load_default()
    
    # Desenhar texto centralizado
    text = "CM+"
    
    # Calcular posição central do texto
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - 20
    
    draw.text((x, y), text, fill='#1e40af', font=font)
    
    # Criar pasta assets se não existir
    os.makedirs('desktop/assets', exist_ok=True)
    
    # Salvar como PNG primeiro
    png_path = 'desktop/assets/icon.png'
    img.save(png_path, 'PNG')
    print(f"✅ PNG criado: {png_path}")
    
    # Converter para ICO com múltiplos tamanhos
    icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    ico_path = 'desktop/assets/icon.ico'
    img.save(ico_path, format='ICO', sizes=icon_sizes)
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
