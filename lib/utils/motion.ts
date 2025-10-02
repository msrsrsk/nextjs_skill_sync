const springTransition = (duration: number, delay: number = 0) => ({
    type: "spring",
    duration: duration,
    delay: delay,
});

const easeInOutTransition = (duration: number) => ({
    duration: duration,
    ease: 'easeInOut',
});

export const accordionAnimation = () => {
    return {
        initial: { height: 0, opacity: 0 },
        animate: { 
            height: 'auto', 
            opacity: 1, 
            transition: easeInOutTransition(0.4)
        },
        exit: { 
            height: 0, 
            opacity: 0, 
            transition: easeInOutTransition(0.4)
        },
    };
};

export const fadeScale = () => {
    return {
		hidden: { opacity: 0, scale: 0.96 },
		show: { opacity: 1, scale: 1, transition: easeInOutTransition(0.2) },
    };
};

export const fadeIn = () => {
    return {
		hidden: { opacity: 0, height: 0, marginTop: 0 },
		show: { 
            opacity: 1, 
            height: "auto", 
            marginTop: "8px", 
            transition: springTransition(0.4) 
        },
    };
};

export const fadeInUp = () => {
    return {
		hidden: { opacity: 0, y: 10 },
		show: { opacity: 1, y: 0, transition: springTransition(0.8) },
    };
};

export const fadeInToast = () => {
    return {
		hidden: { opacity: 0, y: -40 },
		show: { opacity: 1, y: 0, transition: springTransition(0.4) },
    };
};