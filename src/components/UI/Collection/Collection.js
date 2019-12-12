import React from "react";

const UICollection = () => {
  return (
    <div className="card card-register">
      <div className="card-content">
        <div className="media">
          <h3 className="title-with-subtitles light-bold">Collection</h3>
        </div>
        <div className="content">
          <div className="mt-1 mb-1">
            <span>
              Now viewing: <b>AttendenceDemo</b>
            </span>
          </div>
          <button class="button is-primary is-rounded w-100 mb-1">
            Enroll New Person
          </button>
          <article class="panel is-primary">
            <p class="panel-heading">People in Collection</p>
            <div class="panel-block">
              <p class="control has-icons-left">
                <input
                  class="input is-primary"
                  type="text"
                  placeholder="Search"
                />
                <span class="icon is-left">
                  <i class="fas fa-search" aria-hidden="true"></i>
                </span>
              </p>
            </div>
            <div class="panel-block person is-active">
              <span class="panel-icon">
                <i class="fas fa-book" aria-hidden="true"></i>
              </span>
              Obama Barrack
            </div>
            <div class="panel-block person">
              <span class="panel-icon">
                <i class="fas fa-book" aria-hidden="true"></i>
              </span>
              Jeremy Lim
            </div>
            <div class="panel-block person">
              <span class="panel-icon">
                <i class="fas fa-book" aria-hidden="true"></i>
              </span>
              Jun Liang Seow
            </div>
            <div class="panel-block person">
              <span class="panel-icon">
                <i class="fas fa-book" aria-hidden="true"></i>
              </span>
              Choon Hon Goh
            </div>
            <div class="panel-block person">
              <span class="panel-icon">
                <i class="fas fa-book" aria-hidden="true"></i>
              </span>
              Sebastian Ma
            </div>
            <div class="panel-block person">
              <span class="panel-icon">
                <i class="fas fa-book" aria-hidden="true"></i>
              </span>
              Nicholas Chen
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default UICollection;
