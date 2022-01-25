import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import "./Main.css";
import useKeyWords from "../Hooks/KeyWords";
import useSoftSkills from "../Hooks/SoftSkills";

import pairMatch from "../Helpers/pairMatch";
import getScores from "../Helpers/getScores";

import mammoth from "mammoth";
import DonutWithText from "../components/DonutWithText";
import BarChart from "../components/BarChart";
import document_logo from "../assets/img/document_logo.svg";

import ResultTable from "./ResultTable";
import ToggleSwitch from "../components/ToggleSwitch";
import useJobPostings from "../Hooks/jobComponents";

import extrahelp from "../Helpers/extrahelp";

import getJobSpecificWords from "../Helpers/getJobSpecificWords";
const getJobSpecificPosting = getJobSpecificWords.getJobSpecificPosting;
const getJobSpecificResume = getJobSpecificWords.getJobSpecificResume;
const extractWordsOnly = extrahelp.extractWordsOnly;

// const extractWordsOnly = require("../Helpers/extrahelp");
// const getJobSpecificPosting = require("../Helpers/getJobSpecificWords");
// const getJobSpecificResume = require("../Helpers/getJobSpecificWords");


export default function Main() {
  //Storing the sessions
  const storedJobposting = localStorage.getItem('jobPosting') || ""
  const [jobPosting, setJobposting] = useState(storedJobposting)
  const storedResume = localStorage.getItem('resume') || ""
  const [resume, setResume] = useState(storedResume);



  const [hiLightHardSkills, setHiLightHardSkills] = useState([""]);

  const [hiLightVitalSoftSkills, setHiLightVitalSoftSkills] = useState([""]);
  const [submitState, setSubmitState] = useState(false);

  const { keywords } = useKeyWords();
  const { softskills } = useSoftSkills();
  
  const history = useHistory();

  //Cick job search - calling

  //vitalKeywords is an array with the same words of the database and jobposting
  //for hardskills

  const vitalKeywords = pairMatch(keywords, jobPosting);

  //vitalSoftSkills is an array with the same words in the database and jobposting for
  //soft skills

  const vitalSoftSkills = pairMatch(softskills, jobPosting);

  //jobspecific words is words that repeats most in the job posting
  const jobRepeatPosting = getJobSpecificPosting(
    jobPosting,
    vitalKeywords,
    vitalSoftSkills
  );
  const jobRepeatResume = getJobSpecificResume(resume, jobPosting);

  //firstScore and Second score is for the bargraph to rank how many of the keywords for


  const firstScore = (parseFloat(getScores(vitalKeywords, resume))).toFixed(2) || 0;
  const secondScore = (parseFloat(getScores(vitalSoftSkills, resume))).toFixed(2) || 0;
  const thirdScore = (parseFloat(getScores(jobRepeatPosting, resume))).toFixed(2) || 0;
  //resumeAndPosting is an array of the words
  //that repeat on the posting and repeat on the resume with a count of each

  const resumeRepeatFromPosting = pairMatch(keywords, resume);
  const resumeRepeatSoftSkillsPosting = pairMatch(softskills, resume);

  //dummy for the barchart
  //comment this
  const hardSkillScore = parseFloat(firstScore) || 0;
  const softSkillScore = parseFloat(secondScore) || 0;
  const specificKeywords = parseFloat(thirdScore) || 0;
  const skillsSum = hardSkillScore + softSkillScore + specificKeywords;



  const totalScore = 300;
 
  const match = parseFloat(((skillsSum / totalScore) * 100).toFixed(2));
  const unmatch = 100 - match;
 

  //Titles for the table
  const hardSkillTitle = "Hard Skills";
  const softSkillTitle = "Soft Skills";
  const jobSpecificTitle = "Posting Specific Keywords Match";

  const onChange = function (event) {
    setJobposting(event.target.value);
    localStorage.setItem('jobPosting', event.target.value);
  };
  const onChange1 = function (event) {
    setResume(event.target.value);
    localStorage.setItem('resume', event.target.value)
  };
  
  const onClick = function (event) {
    event.preventDefault();

 
    setHiLightHardSkills(extractWordsOnly(vitalKeywords));
    setHiLightVitalSoftSkills(extractWordsOnly(vitalSoftSkills));
    setSubmitState(true)
  };

  const wordTextResume = function (buffer) {
    //reads the file from resume and changes it to text
    mammoth
      .extractRawText({ arrayBuffer: buffer })
      .then(function (result) {
      try{
        const text = result.value; // The raw text
        setResume(text);
      }catch(e){
        alert("Please another file to upload") // our code going bad
      }
      })
      .catch(function (error) {
        alert("Please another file to upload") // mammoth couldnt' handle the input
      });
  };
  const onChangeResume = function (event) {
    //takes the file and reads the file from buffer of array
    const reader = new FileReader();
    const fileData = event.target.files[0];
    if(!fileData.name.endsWith("docx")){
      alert("Please Upload a docx file")
      return
    }
    reader.onloadend = (event) => {
      wordTextResume(event.target.result);
    }; //triggers when the reader stops reading file
    reader.readAsArrayBuffer(fileData);
  };

  const wordTextJob = function (buffer) {
    //reads the file from job and changes it to text
    mammoth
      .extractRawText({ arrayBuffer: buffer })
      .then(function (result) {
      try{
        const text = result.value; // The raw text
        setJobposting(text);
      }catch(e){
        alert("Please another file to upload") // our code going bad
      }
      })
      .catch(function (error) {
        alert("Please another file to upload") // mammoth couldnt' handle the input
      });
  };

  const onChangeJob = function (event) {
    //takes the file and reads the file from buffer of array
    const reader = new FileReader();
    const fileData = event.target.files[0];
    if(!fileData.name.endsWith("docx")){
      alert("Please Upload a docx file")
      return
    }
    reader.onloadend = (event) => {
      wordTextJob(event.target.result);
    }; //triggers when the reader stops reading file
    reader.readAsArrayBuffer(fileData);
  };

  //Job Search component
  const jobSearchKeyword = extractWordsOnly(resumeRepeatFromPosting)
    .slice(0, 5)
    .toString();


  const [countrySelected, setCountrySelected] = useState("");

  const onClick_JobSearch = function (event) {
    // event.preventDefault();
    //set state on the vitalKeywords, firstScore, resumeandPosting
    setCountrySelected(event.target.value);
  };

  const usePrintJobPosting = useJobPostings(jobSearchKeyword, countrySelected);

  const moveToJobSearch = () => {
    history.push({ pathname: "/job-search", data: usePrintJobPosting });
  };

  return (
    <>
      <div class="whole-main">
        <section class="jumbotron text-center">
          <div class="container">
            <h1 class="jumbotron-heading">CvX : Tech Resume Expert</h1>
          </div>

          <div className="logo_container">
            <img src={document_logo}></img>
          </div>
        </section>
        <section className="input">
          <form id="main_form">
            <div class="job-area">
              <textarea
                className="textarea"
                name="job_description"
                placeholder="Paste Your Job Description Here"
                value={jobPosting}
                onChange={onChange}
              ></textarea>
              <form class="job-upload">
                <input
                  type="file"
                  id="myFile"
                  name="filename"
                  onChange={onChangeJob}
                ></input>
              </form>
            </div>
            <div class="resume-area">
              <textarea
                className="textarea"
                name="resume"
                placeholder="Paste your resume or upload file from button given below"
                value={resume}
                onChange={onChange1}
              ></textarea>    
            </div>
          </form>
        </section>
        <input
                  type="file"
                  id="myFile"
                  name="filename"
                  onChange={onChangeResume}
                ></input>

        <button
          type="submit"
          form="main_form"
          value="Submit"
          className="main_button"
          onClick={onClick}
        >
          Submit
        </button>
      </div>
      <br></br>
      {submitState ? <div>
        <div id="overview"><h2>CvX Results</h2></div>
      <div className="results_container">
        <DonutWithText match={match} unmatch={unmatch} />

        <div className="bars_container">
          <span>Hard Skills Match</span>
          <BarChart score={firstScore} />
          <span>Soft Skills Match</span>
          <BarChart score={secondScore} />
          <span>Posting Specific Keywords Match</span>
          <BarChart score={specificKeywords} />
        </div>
      </div>

      <div className="table_highlight_container">
        <div className="result_table_container">
          <ResultTable
            vitalKeywords={vitalKeywords}
            resumeRepeatFromPosting={resumeRepeatFromPosting}
            title={hardSkillTitle}
            />
            <br></br>
          <ResultTable
            vitalKeywords={vitalSoftSkills}
            resumeRepeatFromPosting={resumeRepeatSoftSkillsPosting}
            title={softSkillTitle}
            />
                        <br></br>

          <ResultTable
            vitalKeywords={jobRepeatPosting}
            resumeRepeatFromPosting={jobRepeatResume}
            title={jobSpecificTitle}
            />
        </div>

        <div className="highlight_toggle">
          <div>
            <ToggleSwitch
              hiLightHardSkills={hiLightHardSkills}
              hiLightVitalSoftSkills={hiLightVitalSoftSkills}
              resume={resume}
              />
          </div>

          <div className="job_search_container">
            <div className="location_dropdown">
              <select onChange={onClick_JobSearch}>
              <option className="location_option" value="location">Choose location
              </option>

                <option value="usa">
                United States
                </option>
                <option value="canada">Canada</option>
                <option value="uk">United Kingdom</option>
              </select>
            </div>
           
              <div className="job_search_button">

                <button className="actual_jobSearch_button"  onClick={moveToJobSearch}>Job Search</button>

              </div>
            
            </div>
            
        
        </div>
      
      </div>
              </div> : <div className ="please_input">Please paste or upload a job posting and your resume.</div>}
    
    </>
  );
}
