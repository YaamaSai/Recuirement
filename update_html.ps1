$files = Get-ChildItem -Path d:\5websites\Recuiremnet\pages -Filter *.html

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw

    # Inject the RTL script just before </head> if it's not already there
    if ($content -notmatch "localStorage\.getItem\('dir'\)") {
        $content = $content -replace "</head>", "`n    <script>document.documentElement.dir = localStorage.getItem('dir') || 'ltr';</script>`n</head>"
    }

    # Inject the RTL toggle button just before the theme toggle button if it's not already there
    if ($content -notmatch "rtl-toggle-btn") {
        $content = $content -replace '<button class="theme-toggle-btn"', "<button class=`"rtl-toggle-btn`" aria-label=`"Toggle RTL`">RTL</button>`n                <button class=`"theme-toggle-btn`""
    }

    Set-Content -Path $file.FullName -Value $content -NoNewline
}
Write-Host "All files updated."
