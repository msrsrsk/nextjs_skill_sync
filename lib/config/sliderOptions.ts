export const productSliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "18%",
    infinite: true,
    arrows: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 2400,
            settings: {
                className: "center",
                centerMode: true,
                centerPadding: "18%",
                infinite: true,
                arrows: true,
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 1440,
            settings: {
                className: "center",
                centerMode: true,
                centerPadding: "10%",
                infinite: true,
                arrows: true,
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 768,
            settings: {
                className: "side",
                centerMode: false,
                infinite: false,
                arrows: false,
                slidesToShow: 2.75,
            }
        },
        {
            breakpoint: 640,
            settings: {
                className: "side",
                centerMode: false,
                infinite: false,
                arrows: false,
                slidesToShow: 1.75,
            }
        },
    ]
}

export const reviewSliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "10%",
    infinite: true,
    arrows: true,
    autoplay: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 2400,
            settings: {
                className: "center",
                centerMode: true,
                centerPadding: "12%",
                infinite: true,
                arrows: true,
                autoplay: true,
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 1440,
            settings: {
                className: "center",
                centerMode: true,
                centerPadding: "10%",
                infinite: true,
                arrows: true,
                autoplay: true,
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 960,
            settings: {
                className: "side",
                centerMode: false,
                infinite: false,
                arrows: false,
                autoplay: false,
                slidesToShow: 2.2,
            }
        },
        {
            breakpoint: 640,
            settings: {
                className: "side",
                centerMode: false,
                infinite: false,
                arrows: false,
                autoplay: false,
                slidesToShow: 1.2,
            }
        },
        
    ]
}

export const reviewMainSliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
};

export const reviewThumbsSliderSettings = {
    infinite: false,
    slidesToShow: 5,
    swipeToSlide: true,
    focusOnSelect: true,
    arrows: false,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 3.55,
            }
        },
    ]
};

export const anotherWorldSliderSettings = {
    destroy: true,
    arrows: false,
    responsive: [
        {
            breakpoint: 960,
            settings: {
                destroy: false,
                slidesToShow: 2.55,
                infinite: false,
                arrows: false,
            }
        },
        {
            breakpoint: 640,
            settings: {
                destroy: false,
                slidesToShow: 1.75,
                infinite: false,
                arrows: false,
            }
        },
    ]
};

export const optimalSyncsSliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "12.5%",
    infinite: true,
    arrows: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 2400,
            settings: {
                className: "center",
                centerMode: true,
                centerPadding: "12.5%",
                infinite: true,
                arrows: true,
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 1440,
            settings: {
                className: "center",
                centerMode: true,
                centerPadding: "10%",
                infinite: true,
                arrows: true,
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 768,
            settings: {
                className: "side",
                centerMode: false,
                infinite: false,
                arrows: false,
                slidesToShow: 2.45,
            }
        },
        {
            breakpoint: 640,
            settings: {
                className: "side",
                centerMode: false,
                infinite: false,
                arrows: false,
                slidesToShow: 1.45,
            }
        },
    ]
};