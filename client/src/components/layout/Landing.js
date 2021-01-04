import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import credit_card from "../../img/credit_card.png";
import { useSelector } from "react-redux";

const Landing = (props) => {

    const auth = useSelector(state => state.auth)

    useEffect(() => {
        // If logged in, should redirect them to dashboard
        if (auth.isAuthenticated) {
            props.history.push("/dashboard");
        }
    })

        return (
            <div style={{ height: "75vh" }} className="container valign-wrapper">
                <div className="row">
                    <div className="col s12 center-align">
                        <img
                            src={credit_card}
                            style={{ width: "350px" }}
                            className="responsive-img credit-card"
                            alt="Undraw"
                        />
                        <h4 className="flow-text">
                            A personal banking web app built with with Plaid and the{" "}
                            <span style={{ fontFamily: "monospace" }}>MERN</span> stack
            </h4>
                        <br />
                        <div className="col s6">
                            <Link
                                to="/register"
                                style={{
                                    width: "140px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px"
                                }}
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                            >
                                Register
              </Link>
                        </div>
                        <div className="col s6">
                            <Link
                                to="/login"
                                style={{
                                    width: "140px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px"
                                }}
                                className="btn btn-large btn-flat waves-effect white black-text"
                            >
                                Log In
              </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

export default Landing;