// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function() {
  // Get references to the addNewBtn and tableBody elements
  const addNewBtn = document.getElementById("addNewBtn");
  const tableBody = document.querySelector("table tbody");

  // Initialize variables to store Flatpickr instances and a current ID
  let flatpickrInstances = []; // To store Flatpickr instances
  let currentID = 1;

  // Add a click event listener to the "Add New" button
  addNewBtn.addEventListener("click", function() {
    // Check if the table already has rows
    if (tableBody.childElementCount > 0) {
      // Check if the last row has been submitted
      const lastRow = tableBody.children[0];
      const lastUpdatedColumn = lastRow.querySelector(".last-updated");

      if (lastUpdatedColumn.querySelector("button.submit-btn")) {
        // The last row is not submitted
        alert("Please submit the last row before adding a new one.");
      } else {
        addNewRow();
      }
    } else {
      // If the table is empty, directly add a new row
      addNewRow();
    }
  });

  // Function to add a new row to the table
  function addNewRow() {
    // Create a new row element with various table columns
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
            <td><button class="delete-btn">Delete</button></td>
            <td class="row-id">${currentID}</td>
            <td class="start_date"><input type="date" class="start-date"></td>
            <td class="end_date"><input type="date" class="end-date"></td>
            <td class="month-year"></td>
            <td><input type="text" class="exclude-date" data-input disabled></td>
            <td class="dates-excluded"></td>
            <td class="num-of-days"></td>
            <td><input type="number" class="lead-count" name="lead-count"></td>
            <td class="expected-drr"></td>
            <td class="last-updated"><button class="submit-btn">Submit</button><button class="clear-btn">Clear</button></td>
        `;
    // Increment the current ID
    currentID++;
    // Prepend the new row to the table body
    tableBody.insertBefore(newRow, tableBody.firstChild);

    // Attach event listener to the "Submit" button in the new row
    const submitBtn = newRow.querySelector(".submit-btn");
    submitBtn.addEventListener("click", function() {
      submitRow(newRow);
    });

    // Attach event listener to the "clear" button in the new row
    const clearBtn = newRow.querySelector(".clear-btn");
    clearBtn.addEventListener("click", function() {
      clearRow(newRow);
    });

    // Attach event listener to the "Delete" button in the new row
    const deleteBtn = newRow.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function() {
      deleteRow(newRow);
    });


    // Attach event listeners to "Start Date" and "End Date" inputs in the new row
    const startDateInput = newRow.querySelector(".start-date");
    const endDateInput = newRow.querySelector(".end-date");
    startDateInput.addEventListener("change", updateMonthYear);
    endDateInput.addEventListener("change", updateMonthYear);


    // Initialize Flatpickr for the "exclude-date" input field
    const excludedDatesInput = newRow.querySelector(".exclude-date");
    excludedDatesInput.addEventListener("change", function() {
      updateNumberOfDays(startDateInput, endDateInput, excludedDatesInput, newRow);
    });

    startDateInput.addEventListener("change", function() {
      toggleExcludedDatesInput(startDateInput, endDateInput, excludedDatesInput);
    });
    endDateInput.addEventListener("change", function() {
      toggleExcludedDatesInput(startDateInput, endDateInput, excludedDatesInput);
    });



    // Check the date range and toggle Exclude Dates input state
    function toggleExcludedDatesInput(startDateInput, endDateInput, excludedDatesInput) {
      if (startDateInput.value && endDateInput.value) {
        excludedDatesInput.removeAttribute("disabled");
      } else {
        excludedDatesInput.setAttribute("disabled", true);
        excludedDatesInput.value = ""; // Clear the "Exclude dates" input
      }
    }

    const datesExcludedColumn = newRow.querySelector(".dates-excluded");
    const flatpickrInstance = flatpickr(excludedDatesInput, {
      mode: "multiple",
      dateFormat: "Y-m-d",
      onChange: function(selectedDates, dateStr) {
        // Update the "dates-excluded" column with the selected dates
        datesExcludedColumn.textContent = dateStr;
      },
    });

    flatpickrInstances.push({
      flatpickrInstance,
      startDateInput,
      endDateInput
    });
    // Check the date range
    startDateInput.addEventListener("change", checkDateRange);
    endDateInput.addEventListener("change", checkDateRange);
    startDateInput.addEventListener("change", function() {
      const excludedDatesInput = newRow.querySelector(".exclude-date");
      updateNumberOfDays(startDateInput, endDateInput, excludedDatesInput, newRow);
    });
    endDateInput.addEventListener("change", function() {
      const excludedDatesInput = newRow.querySelector(".exclude-date");
      updateNumberOfDays(startDateInput, endDateInput, excludedDatesInput, newRow);
    });
    excludedDatesInput.addEventListener("click", checkExcludedDates);
  }

  // Function to update Month, Year based on Start Date and End Date
  function updateMonthYear() {
    const row = this.parentElement.parentElement;
    const startDate = new Date(row.querySelector(".start-date").value);
    const endDate = new Date(row.querySelector(".end-date").value);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const monthYear = `${startDate.toLocaleString('default', { month: 'long' })}, ${startDate.getFullYear()}`;
      row.querySelector(".month-year").textContent = monthYear;
    } else {
      row.querySelector(".month-year").textContent = "";
    }
  }

  // Function to check the date range
  function checkDateRange() {
    const row = this.parentElement.parentElement;
    const startDateInput = row.querySelector(".start-date");
    const endDateInput = row.querySelector(".end-date");
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      if (endDate < startDate) {
        alert("End Date should not precede Start Date. Please select valid dates.");
        clearRow(row);
      } 
    }
    // Update disabled dates for all Flatpickr instances
    updateDisableDates();
  }

  // Function to update enabled dates for all Flatpickr instances
  function updateDisableDates() {
    for (const instance of flatpickrInstances) {
      const {
        flatpickrInstance,
        startDateInput,
        endDateInput
      } = instance;

      flatpickrInstance.set("enable", [{
        from: startDateInput.value,
        to: endDateInput.value,
      }, ]);
    }
  }

  // Function to update enabled dates for all Flatpickr instances
  function submitRow(row) {
    // Get input elements from the row
    const startDateInput = row.querySelector(".start-date");
    const endDateInput = row.querySelector(".end-date");
    const leadCountInput = row.querySelector(".lead-count");
    const excludedDatesInput = row.querySelector(".exclude-date");

    // Check if all required inputs are filled
    if (
      startDateInput.value.trim() === "" ||
      endDateInput.value.trim() === "" ||
      leadCountInput.value.trim() === "" ||
      excludedDatesInput.value.trim() === ""
    ) {
      alert("Please fill in all required inputs: Start Date, End Date, Lead Count, and at least one date in Dates Excluded.");
      return; // Prevent submission if any input is missing
    }
    // Check if the number of days is 0
    const numOfDaysCell = row.querySelector(".num-of-days");
    const numOfDays = parseInt(numOfDaysCell.textContent);

    if (isNaN(numOfDays) || numOfDays === 0) {
      alert("Number of days cannot be 0 or empty. Please include at least 1 valid number of days.");
      return; // Prevent submission if number of days is NaN or 0
    }

    const newRow = row.cloneNode(true);

    const inputFields = newRow.querySelectorAll("input");
    inputFields.forEach((input) => {
      const tdTag = document.createElement("td");
      const pTag = document.createElement("p");
      pTag.textContent = input.value;
      tdTag.appendChild(pTag);
      input.parentElement.replaceWith(tdTag);
    });

    const lastUpdated = newRow.querySelector(".last-updated");
    lastUpdated.textContent = new Date().toLocaleString();

    const deleteBtn = newRow.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function() {
      deleteRow(newRow);
    });

    tableBody.appendChild(newRow);
    if (row.previousElementSibling) {
      deleteRow(row.previousElementSibling);
    }
    const firstRow = tableBody.children[0];
    const deleteBtnFirstRow = firstRow.querySelector(".delete-btn");
    deleteBtnFirstRow.click(); // Simulate a click on the delete button
  }

  // Function to delete a row
  function deleteRow(row) {
    tableBody.removeChild(row);
  }

  // Function to check the date range and toggle Exclude Dates input state
  function checkExcludedDates() {
    const row = this.parentElement.parentElement;
    const startDateInput = row.querySelector(".start-date");
    const endDateInput = row.querySelector(".end-date");
    const excludedDatesInput = row.querySelector(".exclude-date");
    const datesExcludedColumn = row.querySelector(".dates-excluded");

    if (!startDateInput.value || !endDateInput.value) {
      alert("Please select the start and end dates first.");
      excludedDatesInput.value = ""; // Clear the "Exclude dates" input
      datesExcludedColumn.textContent = ""; // Clear the "dates excluded" column
    }
  }

  // Function to update Month, Year based on Start Date and End Date
  function updateNumberOfDays(startDateInput, endDateInput, excludedDatesInput, row) {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
      const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      let numExcludedDays = 0;
      const excludedDates = excludedDatesInput.value.split(',').map(dateStr => dateStr.trim());

      if (excludedDates[0] !== '') {
        for (const excludedDate of excludedDates) {
          const excludedDateObj = new Date(excludedDate);
          if (!isNaN(excludedDateObj.getTime()) && excludedDateObj >= startDate && excludedDateObj <= endDate) {
            numExcludedDays++;
          }
        }
      }

      const numDaysAfterExclusion = totalDays - numExcludedDays + 1;

      const numDaysColumn = row.querySelector(".num-of-days");
      numDaysColumn.textContent = numDaysAfterExclusion;

      // Attach event listener to the "Lead Count" input to calculate "Expected DRR"
      const leadCountInput = row.querySelector(".lead-count");
      const expectedDRRColumn = row.querySelector(".expected-drr");
      leadCountInput.addEventListener("input", function() {
        updateExpectedDRR(leadCountInput, numDaysColumn, expectedDRRColumn);
      });

    } else {
      // Handle invalid date range
      row.querySelector(".num-of-days").textContent = "N/A";
    }
  }

  // Function to update the number of days and Expected DRR
  function updateExpectedDRR(leadCountInput, numDaysColumn, expectedDRRColumn) {
    const leadCount = parseInt(leadCountInput.value, 10);
    const numDays = parseInt(numDaysColumn.textContent, 10);

    if (!isNaN(leadCount) && !isNaN(numDays) && numDays > 0) {
      const expectedDRR = (leadCount / numDays).toFixed(2); // You can adjust the precision as needed
      expectedDRRColumn.textContent = expectedDRR;
    } else {
      // Handle invalid input or zero number of days
      expectedDRRColumn.textContent = "N/A";
    }
  }

  //function to clear the row
  function clearRow(row) {
    const inputFields = row.querySelectorAll("input");
    inputFields.forEach((input) => {
      input.value = ""; // Clear input field values
    });

    const datesExcludedColumn = row.querySelector(".dates-excluded");
    datesExcludedColumn.textContent = ""; // Clear the "dates-excluded" column

    const numDaysColumn = row.querySelector(".num-of-days");
    numDaysColumn.textContent = ""; // Clear the "num-of-days" column

    const expectedDRRColumn = row.querySelector(".expected-drr");
    expectedDRRColumn.textContent = ""; // Clear the "expected-drr" column

    row.querySelector(".month-year").textContent = "";
    
    // Reset the Flatpickr instance for "exclude-date" input
    const excludedDatesInput = row.querySelector(".exclude-date");
    if (excludedDatesInput._flatpickr) {
        // Clear the selected dates and enable the date range
        excludedDatesInput._flatpickr.clear();
        excludedDatesInput._flatpickr.set("enable", [{
            from: row.querySelector(".start-date").value,
            to: row.querySelector(".end-date").value,
        }]);
    }
  }

});
