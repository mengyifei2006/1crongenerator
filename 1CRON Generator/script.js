document.addEventListener('DOMContentLoaded', () => {
    const cronOutput = document.getElementById('cron-output');
    const copyBtn = document.getElementById('copy-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');

    const minuteSelect = document.getElementById('minute');
    const hourSelect = document.getElementById('hour');
    const dayMonthSelect = document.getElementById('day-month');
    const monthSelect = document.getElementById('month');
    const dayWeekSelect = document.getElementById('day-week');

    const selects = [minuteSelect, hourSelect, dayMonthSelect, monthSelect, dayWeekSelect];

    // --- Populate Dropdowns ---
    function populateSelects() {
        // Minute (0-59)
        const minuteOptions = [
            { text: 'Every Minute (*)', value: '*' },
            { text: 'Every 5 Minutes (*/5)', value: '*/5' },
            { text: 'Every 15 Minutes (*/15)', value: '*/15' },
            { text: 'Every 30 Minutes (*/30)', value: '*/30' },
        ];
        for (let i = 0; i < 60; i++) {
            minuteOptions.push({ text: `At minute ${i}`, value: i });
        }
        populate(minuteSelect, minuteOptions);

        // Hour (0-23)
        const hourOptions = [
            { text: 'Every Hour (*)', value: '*' },
            { text: 'Every 2 Hours (*/2)', value: '*/2' },
            { text: 'Every 6 Hours (*/6)', value: '*/6' },
            { text: 'At Midnight (0)', value: '0' },
        ];
        for (let i = 0; i < 24; i++) {
            hourOptions.push({ text: `At hour ${i}`, value: i });
        }
        populate(hourSelect, hourOptions);

        // Day of Month (1-31)
        const dayMonthOptions = [
            { text: 'Every Day (*)', value: '*' },
            { text: 'On the 1st', value: '1' },
            { text: 'On the 15th', value: '15' },
        ];
        for (let i = 1; i <= 31; i++) {
            dayMonthOptions.push({ text: `Day ${i}`, value: i });
        }
        populate(dayMonthSelect, dayMonthOptions);

        // Month (1-12)
        const monthOptions = [
            { text: 'Every Month (*)', value: '*' },
            { text: 'January', value: '1' },
            { text: 'February', value: '2' },
            { text: 'March', value: '3' },
            { text: 'April', value: '4' },
            { text: 'May', value: '5' },
            { text: 'June', value: '6' },
            { text: 'July', value: '7' },
            { text: 'August', value: '8' },
            { text: 'September', value: '9' },
            { text: 'October', value: '10' },
            { text: 'November', value: '11' },
            { text: 'December', value: '12' },
        ];
        populate(monthSelect, monthOptions);

        // Day of Week (0-6)
        const dayWeekOptions = [
            { text: 'Every Day (*)', value: '*' },
            { text: 'Monday', value: '1' },
            { text: 'Tuesday', value: '2' },
            { text: 'Wednesday', value: '3' },
            { text: 'Thursday', value: '4' },
            { text: 'Friday', value: '5' },
            { text: 'Saturday', value: '6' },
            { text: 'Sunday', value: '0' },
            { text: 'Weekdays (Mon-Fri)', value: '1-5' },
            { text: 'Weekends (Sat-Sun)', value: '0,6' },
        ];
        populate(dayWeekSelect, dayWeekOptions);
    }

    function populate(selectElement, options) {
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            selectElement.appendChild(option);
        });
    }

    // --- Core Logic ---
    function updateCronOutput() {
        const cronParts = selects.map(s => s.value);
        cronOutput.value = cronParts.join(' ');
    }

    function setCron(cronString) {
        const parts = cronString.split(' ');
        if (parts.length !== 5) return;

        selects.forEach((select, index) => {
            const part = parts[index];
            let found = false;
            // Try to find a direct match in the options
            for (let option of select.options) {
                if (option.value === part) {
                    select.value = part;
                    found = true;
                    break;
                }
            }
            // If no direct match, it might be a custom number not in the main list
            if (!found) {
                // This is a simplification. A full implementation would handle all possible values.
                // For this project, we assume presets set values that exist in the dropdowns.
                select.value = part;
            }
        });
        updateCronOutput();
    }
    
    // --- Event Listeners ---
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cronValue = btn.getAttribute('data-cron');
            setCron(cronValue);
        });
    });

    selects.forEach(select => {
        select.addEventListener('change', updateCronOutput);
    });

    copyBtn.addEventListener('click', () => {
        cronOutput.select();
        navigator.clipboard.writeText(cronOutput.value).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    // --- Initialization ---
    populateSelects();
    setCron('* * * * *'); // Set initial state to 'Every Minute'
});
