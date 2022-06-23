let endpoint = "http://192.168.1.103:3000"

// create a submission cache in localstorage to retry if the server is down
let submissionCache = localStorage.getItem("submissionCache")

if (submissionCache) {
    submissionCache = JSON.parse(submissionCache)
} else {
    submissionCache = {}
}

export async function addSubmissionToDB(submission, metadata) {
    // POST the data
    let response = await fetch(`${endpoint}/submissions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            submission: submission,
            refNumber: metadata.refNumber,
            workflow: metadata.workflow,
            username: metadata.username,
        })});

    return response;
}