from PIL import Image
import os

def update_icons():
    source_path = 'public/characters/zoeyicon.webp'
    
    if not os.path.exists(source_path):
        print(f"Error: Source image not found at {source_path}")
        return

    # Android mipmap directories and sizes
    icon_sizes = {
        'mipmap-mdpi': 48,
        'mipmap-hdpi': 72,
        'mipmap-xhdpi': 96,
        'mipmap-xxhdpi': 144,
        'mipmap-xxxhdpi': 192
    }

    base_res_dir = 'android/app/src/main/res'
    
    try:
        img = Image.open(source_path)
        print(f"Loaded source image: {source_path}")
        
        # Ensure RGBA for transparency if needed, though usually launcher icons are opaque or handled specifically.
        # Converting to RGBA just in case.
        img = img.convert("RGBA")

        for folder, size in icon_sizes.items():
            dir_path = os.path.join(base_res_dir, folder)
            if not os.path.exists(dir_path):
                os.makedirs(dir_path, exist_ok=True)
                print(f"Created directory: {dir_path}")

            # Resize
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # Save normal icon
            icon_path = os.path.join(dir_path, 'ic_launcher.png')
            resized_img.save(icon_path, 'PNG')
            print(f"Saved {icon_path} ({size}x{size})")
            
            # Save round icon (using same image for now as requested, just renamed)
            # Ideally round icon should be masked, but for now we replace the file.
            round_icon_path = os.path.join(dir_path, 'ic_launcher_round.png')
            resized_img.save(round_icon_path, 'PNG')
            print(f"Saved {round_icon_path} ({size}x{size})")
            
        print("Icon update complete!")

    except Exception as e:
        print(f"Error processing icons: {e}")

if __name__ == "__main__":
    update_icons()
