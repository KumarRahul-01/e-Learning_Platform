import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    img: "/img/testimonial-1.jpg",
    name: "Client Name",
    profession: "Profession",
    text: "Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.",
  },
  {
    img: "/img/testimonial-2.jpg",
    name: "Client Name",
    profession: "Profession",
    text: "Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.",
  },
  {
    img: "/img/testimonial-3.jpg",
    name: "Client Name",
    profession: "Profession",
    text: "Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.",
  },
  {
    img: "/img/testimonial-4.jpg",
    name: "Client Name",
    profession: "Profession",
    text: "Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.",
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 992,
      settings: { slidesToShow: 1 },
    },
  ],
};

const Testimonial = () => (
  <div>
    {/* Header Start */}
    <div className="container-fluid bg-primary py-5 mb-5 page-header">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <h1 className="display-3 text-white animated slideInDown">
              Testimonial
            </h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">
                    Pages
                  </a>
                </li>
                <li
                  className="breadcrumb-item text-white active"
                  aria-current="page"
                >
                  Testimonial
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
    {/* Header End */}

    {/* Testimonial Start */}
    <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
      <div className="container">
        <div className="text-center">
          <h6 className="section-title bg-white text-center text-primary px-3">
            Testimonial
          </h6>
          <h1 className="mb-5">Our Students Say!</h1>
        </div>
        <Slider
          {...sliderSettings}
          className="testimonial-carousel position-relative"
        >
          {testimonials.map((t, idx) => (
            <div className="testimonial-item text-center" key={idx}>
              <img
                className="border rounded-circle p-2 mx-auto mb-3"
                src={t.img}
                style={{ width: 80, height: 80 }}
                alt={t.name}
              />
              <h5 className="mb-0">{t.name}</h5>
              <p>{t.profession}</p>
              <div className="testimonial-text bg-light text-center p-4">
                <p className="mb-0">{t.text}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
    {/* Testimonial End */}
  </div>
);

export default Testimonial;
