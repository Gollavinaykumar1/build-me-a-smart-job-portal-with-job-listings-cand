import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { clsx } from 'clsx'
import { FiSettings } from 'react-icons/fi'
import { AiOutlineUser } from 'react-icons/ai'
import { RiFilePaper2Line } from 'react-icons/ri'
import { HiOutlinePencil } from 'react-icons/hi'
import { BASE_URL } from './api'

function App() {
  const [jobs, setJobs] = useState([])
  const [candidates, setCandidates] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const { register, handleSubmit } = useForm()

  useEffect(() => {
    axios.get(`${BASE_URL}/jobs`)
      .then(response => {
        setJobs(response.data)
      })
      .catch(error => {
        toast.error('Failed to load jobs')
      })

    axios.get(`${BASE_URL}/candidates`)
      .then(response => {
        setCandidates(response.data)
      })
      .catch(error => {
        toast.error('Failed to load candidates')
      })
  }, [])

  const handleJobClick = (job) => {
    setSelectedJob(job)
  }

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate)
  }

  const handleApply = (data) => {
    axios.post(`${BASE_URL}/applications`, data)
      .then(response => {
        toast.success('Application submitted successfully')
      })
      .catch(error => {
        toast.error('Failed to submit application')
      })
  }

  const handleSkillMatch = (candidate) => {
    const skills = candidate.skills
    const jobSkills = selectedJob.requirements
    const matchingSkills = skills.filter(skill => jobSkills.includes(skill))
    return matchingSkills.length
  }

  return (
    <HashRouter>
      <ToastContainer />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Smart Job Portal</h1>
        <div className="flex flex-wrap justify-center mb-4">
          {jobs.map((job) => (
            <div key={job.id} className="w-full md:w-1/2 xl:w-1/3 p-4" onClick={() => handleJobClick(job)}>
              <div className="bg-white rounded shadow-md p-4">
                <h2 className="text-xl font-bold mb-2">{job.title}</h2>
                <p className="text-gray-600 mb-2">{job.description}</p>
                <p className="text-gray-600 mb-2">Requirements: {job.requirements.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
        {selectedJob && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Selected Job: {selectedJob.title}</h2>
            <form onSubmit={handleSubmit(handleApply)}>
              <input type="hidden" {...register('jobId')} value={selectedJob.id} />
              <input type="text" {...register('candidateName')} placeholder="Candidate Name" className="mb-2" />
              <input type="email" {...register('candidateEmail')} placeholder="Candidate Email" className="mb-2" />
              <textarea {...register('candidateMessage')} placeholder="Candidate Message" className="mb-2" />
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Apply</button>
            </form>
          </div>
        )}
        <div className="flex flex-wrap justify-center mb-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="w-full md:w-1/2 xl:w-1/3 p-4" onClick={() => handleCandidateClick(candidate)}>
              <div className="bg-white rounded shadow-md p-4">
                <h2 className="text-xl font-bold mb-2">{candidate.name}</h2>
                <p className="text-gray-600 mb-2">Skills: {candidate.skills.join(', ')}</p>
                {selectedJob && (
                  <p className="text-gray-600 mb-2">Matching Skills: {handleSkillMatch(candidate)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </HashRouter>
  )
}

export default App