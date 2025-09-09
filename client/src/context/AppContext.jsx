import { createContext, use } from "react";
import { dummyCourses } from "../assets/assets";
export const AppContext = createContext({});
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  humanizeDuration  from "humanize-duration";
export const AppContextProvider=(props)=>{
    const currency=import.meta.env.VITE_CURRENCY 
    const navigate=useNavigate()
    const[allCourses,setallCourses]=useState([])
    const[isEducator,setisEducator]=useState(true)
        const [enrolledCourses, setEnrolledCourses] = useState([])
    //fetch all courses
    const fetchAllCourses=async()=>{
        setallCourses(dummyCourses)
    }
       const calculateRating = (course) => {

        if (course.courseRatings.length === 0) {
            return 0
        }

        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }
     // Function to Calculate Course Chapter Time
    const calculateChapterTime = (chapter) => {

        let time = 0

        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })


    }
     // Function to Calculate Course Duration
    const calculateCourseDuration = (course) => {

        let time = 0

        course.courseContent.map(
            (chapter) => chapter.chapterContent.map(
                (lecture) => time += lecture.lectureDuration
            )
        )

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })

    }
        const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }
    const fetchUserEnrolledCourses = async () => {
        setEnrolledCourses(dummyCourses)
    }

    useEffect(()=>{
        fetchAllCourses()
        fetchUserEnrolledCourses()
    },[])
    const value={
currency,allCourses,navigate,calculateRating,isEducator,setisEducator,calculateChapterTime,calculateCourseDuration ,calculateNoOfLectures,enrolledCourses,fetchUserEnrolledCourses   }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}