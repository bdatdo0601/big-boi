export default isDark => ({
  particles: {
    number: {
      value: 50,
      density: {
        enable: false,
        value_area: 1140,
      },
    },
    color: {
      value: isDark ? "#ffffff" : "#736a73",
    },
    shape: {
      type: "circle",
      stroke: {
        width: 10,
        color: isDark ? "#ffffff" : "#736a73",
      },
      polygon: {
        nb_sides: 7,
      },
      image: {
        src: "img/github.svg",
        width: 200,
        height: 1910,
      },
    },
    opacity: {
      value: 0.15232414578222467,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 3,
      random: false,
      anim: {
        enable: false,
        speed: 4.872463273808071,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 200,
      color: isDark ? "#ffffff" : "#736a73",
      opacity: 0.1736124811591,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1.6,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "bounce",
      bounce: true,
      attract: {
        enable: false,
        rotateX: 868.0624057955,
        rotateY: 641.3648243462092,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 231.44200550588337,
        line_linked: {
          opacity: 0.33190049461268845,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 0.6252994534720357,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
});
