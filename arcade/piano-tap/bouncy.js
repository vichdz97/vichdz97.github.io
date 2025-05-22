window.addEventListener('load', () => {
    const sounds = document.querySelectorAll(".sound");
    const pads = document.querySelectorAll(".pads div");
    const visual = document.querySelector(".visual");
    const colors = [
        "#f2725d", /* red */
        "#fccf4b", /* orange */
        "#ffff50", /* yellow */
        "#aff7b6", /* green */
        "#93ecf8", /* blue */
        "#ddaaff", /* purple */
        "#ffaaff", /* pink */
        "#f2725d"  /* red */
    ];

    // play sound
    pads.forEach((pad, index) => {
        pad.addEventListener('click', function() {
            sounds[index].currentTime = 0;
            sounds[index].play();

            createBubbles(index);
        });
    });

    // make bubbles
    const createBubbles = (index) => {
        const bubble = document.createElement("div");
        visual.appendChild(bubble);
        bubble.style.backgroundColor = colors[index];
        bubble.style.animation = 'jump 1s ease';
        bubble.addEventListener('animationend', function() {
            visual.removeChild(this);
        });
    };
});