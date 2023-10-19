# JavaScript Assignment from Hunt Digital Media

deployed link = https://sammedcjain.github.io/Hunt.Digital.Media_assignment/

A website has been designed to generate a DRR (Daily Run Rate) Report, which tracks daily lead delivery with precision. 
Users have to select several entries, such as Start Date, End Date, Dates Excluded, and Lead count. 
Month, year, Number of Days, and expected DRR entries are calculated automatically using JavaScript.

All the requirements have been satisfied:

1. **Date Selection**
   - A date picker for selecting the 'Start Date' and 'End Date' has been designed.
   - An alert message will be displayed if the user selects an end date that precedes the start date.
   - Month and year will be automatically displayed after picking the start and end date.

2. **Exclude Dates**
   - An external widget called "flatpickr" has been used to design the calendar in the Exclude Dates column.
   - Users can select multiple dates with this calendar.
   - Users will only be able to exclude dates within the specified range, i.e., from the start date to the end date.
   - The selected dates are visually distinguishable in this date picker.
   - Users are allowed to select the dates in this column only after choosing the start and end dates; until then, this date picker will be disabled.
   - The total number of dates excluded will be displayed as comma-separated values in the next column.

3. **Number of Days**
   - The Number of Days will be automatically computed between the chosen dates, excluding the ones marked in the previous step (in the Exclude Dates column).

4. **Lead Count and Expected DRR**
   - Expected DRR is calculated and displayed automatically by considering the number of days and lead count input.

5. **ID Generation** 
   - IDs are assigned to each entry in the table, starting from the number 1.

6. **Button Functionalities**
   - Users can submit the row by clicking on the submit button at the last. Once the submit button is clicked, all the entries will be added to the table.
   - The submit button only works when all the entries are filled, and at least 1 day is excluded in the Exclude Dates column and if at least 1 day is present in the Number of Days column.
   - After submitting the row entry, the last updated time and date will be added to the last column.
   - Users can clear all the row entries by clicking on the clear button.
   - The Add New button adds a new row to the table where users can fill new entries. The Add New button will not work if there is an existing row entry that is not submitted.
   - Delete button at the extreme left deletes the row entry from the table.
