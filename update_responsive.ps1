$files = Get-ChildItem -Path d:\5websites\Recuiremnet\pages -Filter *.html

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw

    # 1. Inject responsive.css if not present
    if ($content -notmatch "responsive\.css") {
        $content = $content -replace '<link rel="stylesheet" href="../assets/css/style.css">', "<link rel=`"stylesheet`" href=`"../assets/css/style.css`">`n    <link rel=`"stylesheet`" href=`"../assets/css/responsive.css`">"
    }

    # 2. Update hamburger menu markup to use spans instead of SVG for CSS animation
    $svgRegex = '(?s)<button class="hamburger"[^>]*>.*?<\/button>'
    $spanHamburger = "<button class=`"hamburger`" aria-label=`"Toggle Navigation`">`n                <span></span>`n                <span></span>`n                <span></span>`n            </button>"
    $content = $content -replace $svgRegex, $spanHamburger

    # 3. Add dashboard hamburger specifically for dashboard pages
    if ($file.Name -match "dashboard\.html") {
        if ($content -notmatch "dashboard-hamburger") {
            $dashButton = "`n    <button class=`"dashboard-hamburger`" aria-label=`"Toggle Sidebar`" style=`"display:none;`">`n        <svg width=`"24`" height=`"24`" viewBox=`"0 0 24 24`" fill=`"none`" stroke=`"currentColor`" stroke-width=`"2`" stroke-linecap=`"round`" stroke-linejoin=`"round`">`n            <line x1=`"3`" y1=`"12`" x2=`"21`" y2=`"12`"></line>`n            <line x1=`"3`" y1=`"6`" x2=`"21`" y2=`"6`"></line>`n            <line x1=`"3`" y1=`"18`" x2=`"21`" y2=`"18`"></line>`n        </svg>`n    </button>`n</body>"
            $content = $content -replace "</body>", $dashButton
        }
    }

    Set-Content -Path $file.FullName -Value $content -NoNewline
}

# Also update documentation/index.html just in case
$docFile = "d:\5websites\Recuiremnet\documentation\index.html"
if (Test-Path $docFile) {
    $content = Get-Content -Path $docFile -Raw
    if ($content -notmatch "responsive\.css") {
        $content = $content -replace '<link rel="stylesheet" href="../assets/css/style.css">', "<link rel=`"stylesheet`" href=`"../assets/css/style.css`">`n    <link rel=`"stylesheet`" href=`"../assets/css/responsive.css`">"
    }
    Set-Content -Path $docFile -Value $content -NoNewline
}

Write-Host "Responsive updates applied to all HTML files."
