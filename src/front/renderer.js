(async () => {
    gsap.registerPlugin(Flip);

    const appContainer = document.getElementById('app-container');
    const applications = await handle.getApplications();

    const bgPath = await handle.getBackgroundPath();
    document.body.style.backgroundImage = `url('${bgPath}')`;

    for (const [appKey, app] of Object.entries(applications)) {
        appContainer.appendChild(newAppButton(appKey, app));
    }

    gsap.set('.app-button', {
        opacity: 0,
        y: 20
    });

    setTimeout(introAnimation, 0);
})();

function newAppButton(appKey, app) {
    const button = document.createElement('div');
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

    // Click handling
    let mousedownTween;
    let isMousedown = false;
    button.addEventListener('mousedown', () => {
        isMousedown = true;
        mousedownTween = gsap.to(button, { 
            y: 5, 
            scale: 0.98, 
            duration: 0.1,
            onComplete: () => mousedownTween = undefined
        });
    });
    button.addEventListener('click', (event) => {
        isMousedown = false;
        if (mousedownTween) mousedownTween.kill();
        onAppButtonClick(button, appKey, !event.shiftKey);
    });
    button.addEventListener('mouseleave', () => {
        if (!isMousedown) return;
        isMousedown = false;

        gsap.to(button, {
            y: 0,
            scale: 1,
            duration: 0.3,
        });
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

function onAppButtonClick(buttonElement, appKey, quitLauncher) {
    if (quitLauncher) {
        startOnce(buttonElement, appKey);
    } else {
        gsap.set(buttonElement, { rotateY: 180 });
        gsap.to(buttonElement, { y: 0, scale: 1, rotateY: 0, duration: 0.3 });
        handle.runApplication(appKey);
    }

}

function startOnce(buttonElement, appKey) {
    // We place the button in an absolute-positioned container 
    // that will center it in the viewport
    const container = createAbsoluteAppContainer();
    document.body.appendChild(container);
    // This will prevent the mouse from hovering anything
    document.body.appendChild(createAbsoluteAppContainer());
    // We use this placeholder so the layout in the flexbox
    // isn't affected when we remove the button
    const placeholder = createAppButtonPlaceholder();

    // Setting the initial values before recording the flip
    gsap.set(container, { backgroundColor: '#16262E00' });

    const state = Flip.getState([buttonElement, container], { props: 'backgroundColor' });

    // Changing states
    buttonElement.replaceWith(placeholder);
    container.appendChild(buttonElement);

    gsap.set(container, { backgroundColor: '#16262E80' });
    gsap.set(buttonElement, { scale: 2 });

    // Running the flip.
    Flip.from(state, {
        scale: true,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
            handle.runApplication(appKey);
            setTimeout(handle.quit, 5000);
        }
    });
}

function createAbsoluteAppContainer() {
    const container = document.createElement('div');
    container.classList.add('absolute-app-container');
    return container;
}

function createAppButtonPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.classList.add('app-button-placeholder');
    return placeholder;
}