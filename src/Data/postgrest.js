import {store} from "../Redux/store";
import databaseQueueSlice from "../Redux/databaseQueueSlice";

let endpoint = "http://192.168.1.103:3000"

async function attemptDBWrite(data) {
    // Try a DB write, timing out if the response takes longer than 2 seconds.
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 2000)

    return fetch(endpoint + "/submissions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data),
        signal: controller.signal
    }).then(response => {
        return(response.status === 201)
    }).catch(() => {
        return false
    })

}

export async function addSubmissionToDBOrQueue(submission, metadata) {
    // convert submission to db schema
    let data = {
        timestamp: new Date().toISOString(),
        submission: submission,
        refNumber: metadata.refNumber,
        username: metadata.username,
        workflow: metadata.workflow
    }
    attemptDBWrite(data).then(success => {
        if (!success) {
            store.dispatch(databaseQueueSlice.actions.add(data))
        }
    })
}

// every 3 seconds, check the database queue and send any queued requests
setInterval(() => {
    let queue = store.getState().databaseQueue;
    if (queue.length > 0) {
        attemptDBWrite(queue).then(success => {
            if (success) {
                store.dispatch(databaseQueueSlice.actions.clear());
            }
        });
    }
}, 3000);