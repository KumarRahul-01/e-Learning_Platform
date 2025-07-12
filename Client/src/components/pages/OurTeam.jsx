import React from "react";

const OurTeam = () => (
  <div>
    {/* Header Start */}
    <div className="container-fluid bg-primary py-5 mb-5 page-header">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <h1 className="display-3 text-white animated slideInDown">
              Our Team
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
                  Team
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
    {/* Header End */}

    {/* Team Start */}
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="section-title bg-white text-center text-primary px-3">
            Instructors
          </h6>
          <h1 className="mb-5">Expert Instructors</h1>
        </div>
        <div className="row g-4">
          {[
            "/img/team-1.jpg",
            "/img/team-2.jpg",
            "/img/team-3.jpg",
            "/img/team-4.jpg",
            "/img/team-2.jpg",
            "/img/team-3.jpg",
            "/img/team-4.jpg",
            "/img/team-1.jpg",
          ].map((img, idx) => (
            <div
              className="col-lg-3 col-md-6 wow fadeInUp"
              data-wow-delay={`0.${(idx % 4) + 1}s`}
              key={idx}
            >
              <div className="team-item bg-light">
                <div className="overflow-hidden">
                  <img className="img-fluid" src={img} alt="" />
                </div>
                <div
                  className="position-relative d-flex justify-content-center"
                  style={{ marginTop: "-23px" }}
                >
                  <div className="bg-light d-flex justify-content-center pt-2 px-1">
                    <a className="btn btn-sm-square btn-primary mx-1" href="">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Instructor Name</h5>
                  <small>Designation</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* Team End */}
  </div>
);

export default OurTeam;
