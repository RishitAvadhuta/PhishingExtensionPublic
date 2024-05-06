/**
 * Defines the functions for {@param checkPhishing} by posting the URL to python.
 */
async function checkPhishing(manual = false, url) {
    console.log("Trying to process data for URL: ", url);
    try {
        let phishing;
        const timeoutDuration = 10000; // 10 seconds
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort(); // Abort the fetch request if timeout occurs
        }, timeoutDuration);



        fetch('http://localhost:5000/process_data', {
            signal: controller.signal,
            method: 'POST',
            body: url,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                clearTimeout(timeout);
                console.log("RESPONSE: ", response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Get the response as raw text
            })
            .then(data => {
                // Handle the response data
                clearTimeout(timeout);
                console.log('Prediction:', data, " and STRINGIFY: ", data.toString());
                phishing = data.toString() === "[1]";
                console.log(phishing);
                if (phishing) {
                    window.location.assign("warn.html");
                    alert("Site Looks suspicious. Please do not enter any personal information.");
                } else if (!phishing) {
                    console.log("safe");
                    if (manual) {
                        window.location.assign("safe.html");
                    }
                } else {
                    window.location.assign("error.html");
                }

            })
            .catch(e => {
                // Handle errors
                clearTimeout(timeout); // Clear the timeout if an error occurs
                if (e.name === 'AbortError') {
                  // Request was aborted due to timeout
                  console.error('Request timed out');
                } else {
                    console.error('Error:', e);
                }
                phishing = null;
            });
    } catch (e) {
        console.error("POPUP : ", e);
    }
    
}


try {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.clear();
        chrome.action.onClicked.addListener(checkPhishing(true, tabs[0].url));
    });

    console.log("clicked");
} catch (e) {
   console.error("POPUP (61): ", e);
}
