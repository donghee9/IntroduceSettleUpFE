document.addEventListener('DOMContentLoaded', () => {
    const githubBtn = document.getElementById('github-btn');
    const howToMakeBtn = document.getElementById('how-to-make-btn');
    const contentContainer = document.getElementById('content-container');
    const languageSelection = document.getElementById('language-selection');
    const reportIssueBtn = document.getElementById('report-issue-btn');
    const reportIssueContainer = document.getElementById('report-issue-container');
    const closeButton = document.querySelector('.close-button');
    const reportIssueForm = document.getElementById('report-issue-form');
    const waitingMessage = document.getElementById('waiting-message');
    const feedbackMessage = document.getElementById('feedback-message');
    const goToBackBtn = document.getElementById('go-to-back-btn');

    const axiosInstance = axios.create({
        baseURL: "https://server2a.settleup.store/",
        withCredentials: true,
    });


    //     const axiosInstance = axios.create({
    //     baseURL: "https://ddfb-125-132-224-129.ngrok-free.app",
    //     withCredentials: true,
    // });

    axiosInstance.interceptors.request.use(
        (config) => {
            config.headers["ngrok-skip-browser-warning"] = "true";
            const url = config.url || "";
            const excludeEndpoints = ["/login", "/auth/login/social/kakao","/users/feedback/email"];

            if (!excludeEndpoints.includes(url)) {
                const accessToken = sessionStorage.getItem("accessToken");
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }

                if (config.params) {
                    for (const key in config.params) {
                        if (config.params.hasOwnProperty(key) && config.params[key] != null) {
                            config.params[key] = encodeURIComponent(config.params[key]);
                        }
                    }
                }
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    githubBtn.addEventListener('click', () => {
        window.location.href = 'https://github.com/Settle-Up/settle-up-client';
    });

    howToMakeBtn.addEventListener('click', () => {
        contentContainer.classList.add('active');
        languageSelection.style.display = 'none';
        goToBackBtn.style.display = 'block';
    });

    goToBackBtn.addEventListener('click', () => {
        contentContainer.classList.remove('active');
        languageSelection.style.display = 'flex';
        goToBackBtn.style.display = 'none';
    });

    reportIssueBtn.addEventListener('click', () => {
        reportIssueContainer.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        reportIssueContainer.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === reportIssueContainer) {
            reportIssueContainer.style.display = 'none';
        }
    });

    reportIssueForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const issueLocation = document.getElementById('issue-location').value;
        const issueDescription = document.getElementById('issue-description').value;
        const replyEmailAddress = document.getElementById('reply-email-address').value;
        const serverOrClient = false; // 클라이언트는 false

        waitingMessage.style.display = 'block';

        axiosInstance.post('/users/feedback/email', {
            issueLocation,
            issueDescription,
            replyEmailAddress,
            serverOrClient 
        })
        .catch(error => {
            console.error('Error:', error);
        });

        setTimeout(() => {
            waitingMessage.style.display = 'none';
            feedbackMessage.style.display = 'block';
        }, 3000); // Display the feedback message after 3 seconds

        setTimeout(() => {
            feedbackMessage.style.display = 'none';
            reportIssueContainer.style.display = 'none';
        }, 5000); // Hide the feedback message and modal after 5 seconds
    });
});
