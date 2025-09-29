// Command To Execute
// docker run --rm -i --network host -v "${PWD}/K6Testing:/scripts" grafana/k6 run -o influxdb="http://localhost:8080/k6" /scripts/test.js

import http from 'k6/http';

import { sleep } from 'k6';

export const options = {
    iterations: 1000
}

function validateGetProfile() {
    http.get("http://localhost:8080/service1/user/get-profile",
        { headers: { "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2MjQwN2QxLThhODUtNGFhYi1hYzViLWFkNDQyMmUxNWYzYiIsImVtYWlsIjoicmFkYWRpeWF0YXBhbjkwQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsIm1mYSI6dHJ1ZSwiaWF0IjoxNzU4MzA3NTQ0LCJleHAiOjE3NTgzMDg0NDR9.8oCmVWVril7ZpzeSWgCZM3QYhS6_xoRXkvybdjVkkic` } })
    // sleep(1)
}

function validateGetCourseDetails() {
    http.get("http://localhost:8080/service2/course/course/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7", { headers: { "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2MjQwN2QxLThhODUtNGFhYi1hYzViLWFkNDQyMmUxNWYzYiIsImVtYWlsIjoicmFkYWRpeWF0YXBhbjkwQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsIm1mYSI6dHJ1ZSwiaWF0IjoxNzU4MzA3NTQ0LCJleHAiOjE3NTgzMDg0NDR9.8oCmVWVril7ZpzeSWgCZM3QYhS6_xoRXkvybdjVkkic` } })
    // sleep(1)
}
export default function () {
    validateGetCourseDetails()
    validateGetProfile()
}