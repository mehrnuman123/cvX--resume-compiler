import React from "react";
import "./footer.css";
import "./head.js";

export default function Footer() {
  return (
    <div>
    <footer class="site-footer">
    <div class="container">
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h6>About</h6>
              <p class="text-justify">CvX <i>Your Global Tech Resume Expert</i> is an essential tool for those who are tech field and looking for a job. From internship to senior roles in tech support, information technology or engineer roles. We got you covered.</p>
          </div>
           <div class="col-xs-6 col-md-3">
            <h6>Quick Links</h6>
            <ul class="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/main">Main</a></li>


          </ul>
            </div>
              </div>
                </div>
                  <div class="container">
                    <div class="row">
                      <div class="col-md-8 col-sm-6 col-xs-12">
                        <p class="copyright-text">Copyright &copy; 2020 All Rights Reserved by <a href="#">CvX</a></p>
                      </div>
                
      </div>
    </div>
    
    </footer>
    </div>
  );
}

