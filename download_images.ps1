
# Create images directory if it doesn't exist
$imagesDir = Join-Path $PSScriptRoot "images"
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir | Out-Null
    Write-Host "Created images directory at $imagesDir"
}

# List of image URLs to download
$imageUrls = @(
    # Open Graph and Schema images
    "https://content.jdmagicbox.com/comp/kanpur/dc/0512px512.x512.1220087539q3a4a4.dc/catalogue/gaurav-furniture-kanpur-e1rqs.jpg",
    "https://5.imimg.com/data5/ANDROID/Default/2021/7/ZB/HS/ML/114377023/1627368183112-jpg-500x500.jpg",
    "https://5.imimg.com/data5/ANDROID/Default/2021/7/CH/RW/DR/114377023/1627367889695-jpg-500x500.jpg",
    
    # Hero and About section images
    "https://content.jdmagicbox.com/comp/kanpur/dc/0512px512.x512.1220087539q3a4a4.dc/catalogue/gaurav-furniture-kanpur-e1rqs.jpg?w=1920&q=75",
    "https://content.jdmagicbox.com/comp/kanpur/dc/0512px512.x512.1220087539q3a4a4.dc/catalogue/gaurav-furniture-kanpur-e1rqs.jpg?w=800&q=75",
    
    # Gallery images (IMC)
    "https://5.imimg.com/data5/ANDROID/Default/2021/7/RO/DM/YJ/114377023/img-20210615-wa0021-jpg-500x500.jpg",
    "https://5.imimg.com/data5/ANDROID/Default/2021/7/CZ/ER/LC/114377023/img-20210303-wa0065-jpg-500x500.jpg",
    
    # JD Magicbox showroom
    "https://content.jdmagicbox.com/comp/kanpur/dc/0512px512.x512.1220087539q3a4a4.dc/catalogue/gaurav-furniture-kanpur-e1rqs.jpg?w=1200&q=75",
    "https://content.jdmagicbox.com/comp/kanpur/dc/0512px512.x512.1220087539q3a4a4.dc/catalogue/gaurav-furniture-kanpur-e1rqs.jpg?w=600&q=75",
    
    # Unsplash images
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    "https://images.unsplash.com/photo-1617806118773-884d0e7739a0?w=800&q=80",
    "https://images.unsplash.com/photo-1617806118773-884d0e7739a0?w=600&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    "https://images.unsplash.com/photo-1538688520868-9b9f6f5b1a24?w=800&q=80",
    "https://images.unsplash.com/photo-1538688520868-9b9f6f5b1a24?w=600&q=80",
    "https://images.unsplash.com/photo-1580480057633-f0e4b2c9d4c8?w=800&q=80",
    "https://images.unsplash.com/photo-1580480057633-f0e4b2c9d4c8?w=600&q=80",
    "https://images.unsplash.com/photo-1595428774223-ef52624120b2?w=800&q=80",
    "https://images.unsplash.com/photo-1595428774223-ef52624120b2?w=600&q=80"
)

# Function to clean filename
function Clean-Filename {
    param([string]$url)
    $filename = [System.IO.Path]::GetFileName($url.Split('?')[0])
    if ([string]::IsNullOrEmpty($filename)) {
        $filename = "image_" + [System.Guid]::NewGuid().ToString().Substring(0, 8) + ".jpg"
    }
    # Replace invalid characters
    $invalidChars = [System.IO.Path]::GetInvalidFileNameChars()
    foreach ($char in $invalidChars) {
        $filename = $filename.Replace($char, '_')
    }
    return $filename
}

# Download each image
foreach ($url in $imageUrls) {
    try {
        $filename = Clean-Filename $url
        $destination = Join-Path $imagesDir $filename
        
        Write-Host "Downloading: $url"
        Write-Host "Saving to: $destination"
        
        Invoke-WebRequest -Uri $url -OutFile $destination -UseBasicParsing
        Write-Host "Successfully downloaded: $filename" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to download $url : $_" -ForegroundColor Red
    }
}

Write-Host "`nDownload process complete!" -ForegroundColor Cyan
