declare module 'slick-carousel' {
    interface SlickSettings {
        className?: string;
        centerMode?: boolean;
        centerPadding?: string;
        infinite?: boolean;
        arrows?: boolean;
        slidesToShow?: number;
        slidesToScroll?: number;
        responsive?: SlickResponsiveSettings[];
        autoplay?: boolean;
        speed?: number;
        fade?: boolean;
        swipeToSlide?: boolean;
        focusOnSelect?: boolean;
        destroy?: boolean;
    }

    interface SlickResponsiveSettings {
        breakpoint: number;
        settings: SlickSettings | 'unslick';
    }
}