document.addEventListener('DOMContentLoaded', () => {
    const monthForm = document.getElementById('monthForm');
    const hoursTableBody = document.querySelector('#hoursTable tbody');
    const totalHoursElement = document.getElementById('totalHours');
    let totalHours = 0;

    monthForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const monthStartDate = new Date(event.target.monthStartDate.value);
        if (isNaN(monthStartDate)) return;

        // Clear previous dates and table content
        hoursTableBody.querySelectorAll('td.date-cell').forEach(td => td.textContent = '');
        hoursTableBody.querySelectorAll('td[contenteditable="true"]').forEach(td => {
            td.textContent = '';
            td.classList.remove('gray-out');
            td.setAttribute('contenteditable', 'true');
        });
        totalHours = 0;
        totalHoursElement.textContent = totalHours;

        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const startDayIndex = (monthStartDate.getDay() + 6) % 7; // Adjust to make Monday the first day
        const startDate = monthStartDate.getDate();

        if (startDayIndex > 0) {
            for (let i = 0; i < startDayIndex; i++) {
                const row = Array.from(hoursTableBody.rows).find(row => row.cells[0].textContent === daysOfWeek[i]);
                if (row) {
                    const previousDate = new Date(monthStartDate);
                    previousDate.setDate(startDate - (startDayIndex - i));
                    row.cells[1].textContent = previousDate.getDate().toString().padStart(2, '0') + '/' + (previousDate.getMonth() + 1).toString().padStart(2, '0');
                    row.cells[1].classList.add('gray-out');
                    row.cells[1].setAttribute('contenteditable', 'false');
                    row.cells[2].classList.add('gray-out');
                    row.cells[2].setAttribute('contenteditable', 'false');
                }
            }
        }

        let date = new Date(monthStartDate);
        const endDate = new Date(monthStartDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(monthStartDate.getDate() - 1);

        while (date <= endDate) {
            const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7];
            const row = Array.from(hoursTableBody.rows).find(row => row.cells[0].textContent === dayOfWeek);

            if (row) {
                for (let i = 1; i < row.cells.length; i += 2) {
                    if (!row.cells[i].textContent) {
                        row.cells[i].textContent = date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0');
                        break;
                    }
                }
            }
            date.setDate(date.getDate() + 1);
        }
    });

    hoursTableBody.addEventListener('input', (event) => {
        if (event.target.matches('td[contenteditable="true"]')) {
            calculateTotalHours();
        }
    });

    function calculateTotalHours() {
        totalHours = 0;
        hoursTableBody.querySelectorAll('td[contenteditable="true"]').forEach(cell => {
            const hours = parseFloat(cell.textContent);
            if (!isNaN(hours)) {
                totalHours += hours;
            }
        });
        totalHoursElement.textContent = totalHours;
    }
});