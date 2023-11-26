(async () => {
    const appContainer = document.getElementById('app-container');
    const applications = await handle.getApplications();

    const bgPath = await handle.getBackgroundPath();
    document.body.style.backgroundImage = `url('${bgPath}')`;

    for (const [appKey, app] of Object.entries(applications)) {
        appContainer.appendChild(createAppButton(appKey, app));
    }

    gsap.set('.app-button', {
        opacity: 0,
        y: 20
    });

    setTimeout(introAnimation, 0);
})();

function createAppButton(appKey, app) {
    const button = document.createElement('div');
    button.addEventListener('click', () => {
        handle.runApplication(appKey);
    });
    button.classList.add('app-button', 'glass');
    button.appendChild(createIcon(app.icon));
    button.appendChild(createAppName(app.name));

    // Hover animations
    button.addEventListener('mouseenter', () => {
        gsap.to(button.getElementsByTagName('span'), { y: 0, ease: 'back.out(1)', duration: 0.3 });
        gsap.to(button.getElementsByTagName('img'), { filter: 'blur(5px)', duration: 0.3 });
    });
    button.addEventListener('mouseleave', () => {
        gsap.to(button.getElementsByTagName('span'), { y: 100, duration: 0.3 });
        gsap.to(button.getElementsByTagName('img'), { filter: 'blur(0px)', duration: 0.3 });
    });
    // Click animations
    button.addEventListener('mousedown', () => {
        gsap.to(button, { y: 5, scale: 0.98, duration: 0.1 });
    });
    button.addEventListener('mouseup', () => {
        gsap.set(button, { rotateY: 180 });
        gsap.to(button, { y: 0, scale: 1, rotateY: 0, duration: 0.3 });
    });

    return button;
}

function createIcon(iconPath) {
    const icon = document.createElement('img');
    icon.src = iconPath;
    return icon;
}

function createAppName(appName) {
    const span = document.createElement('span');
    span.innerText = appName;
    return span;
}

function introAnimation() {
    const tl = gsap.timeline();

    tl.to('#loading-screen img', {
        y: '100vh',
        ease: 'back.in(1)'
    }, 0.5);
    
    tl.to('#loading-screen', {
        opacity: 0,
        onComplete: () => document.getElementById('loading-screen').remove()
    }, '>');
    
    tl.to('.app-button', {
        opacity: 1,
        y: 0,
        stagger: 0.1
    }, '<');
}