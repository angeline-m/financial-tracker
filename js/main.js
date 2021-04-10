// Enter JavaScript for the exercise here...

window.addEventListener('load', function(e){
    //Creating the array
    const transactionArray = [];

    //Selectors
    const form = document.querySelector('.frm-transactions');
    const paymentOptions = document.querySelector('select.frm-control');
    const errorMsg = document.querySelector('.error');
    const tableBody = document.querySelector('.transactions tbody');
    let debitTotal = document.querySelector('.debits');
    let creditTotal = document.querySelector('.credits');

    //function to reload page if the user is inactive and reset the timer if they do interact with the window
    function idleTime() {
        var time;

        //reset time if they interact with the window
        window.onmousemove = resetTimer;
        window.onclick = resetTimer;
        window.onkeypress = resetTimer;
        form.submit = resetTimer;
    
        //reload page and alert user
        function refreshPage() {
            alert('This page will be reloaded due to inactivity.');
            window.location.href = 'index.html';
        }
    
        //reset time and call page reload
        function resetTimer() {
            clearTimeout(time);
            time = setTimeout(refreshPage, 120000);
        }
    }

    //call the function
    idleTime();
    
    //Form Event Listener
    form.addEventListener('submit', function(e){
        e.preventDefault();

        //unique id for each transaction object
        let id = uuidv4().substr(0, 8);
        
        //Selectors
        let description = document.getElementsByName('description')[0].value;
        let amount = document.getElementsByName('currency')[0].value;
        let paymentType = paymentOptions.value;

        //template literal
        let template = `<table>
        <tr class="${paymentType}">
        <td>${description}</td>
        <td>${paymentType}</td>
        <td class="amount">$${amount}</td>
        <td class="tools">
            <i class="delete fa fa-trash-o" data-key="${id}"></i>
        </td></tr>
        </table>`;

        //if invalid payment type is selected
        if (paymentType == ""){
            giveError("Invalid payment type");
        }
        //if amount is not positive (this block will never be visited because of the min value set in the input in the HTML)
        else if (amount < 0) {
            giveError("Invalid transaction amount");
        }
        //if all else is valid
        else {
            //create the fragment
            let transaction = document.createRange().createContextualFragment(template);

            //create the object and add it to the array
            const transactionObj = {id, description, paymentType, amount};
            transactionArray.push(transactionObj);

            //select the delete button
            let deleteBtn = transaction.querySelector('.delete');

            //add fragment to the DOM
            tableBody.appendChild(transaction.querySelector('tr'));

            //call the function to update debit/credit totals once transaction is added
            updateTotals(transactionArray);
            
            deleteBtn.addEventListener('click', function(e){

                //return the item in which its delete button is being pressed
                const deleteItem = transactionArray.find(function(item, index){
                    if(item.id == e.currentTarget.dataset.key){
                        item.index = index;
                        return item;
                    }
                });

                //Creating the warning box and the response bool
                let response = false;

                if (confirm("Are you sure you want to delete the transaction? Press OK to confirm deletion.")){
                    response = true;
                }

                //If the user confirms deletion
                if (response){
                    
                    //remove the transaction from the DOM
                    tableBody.removeChild(tableBody.children[deleteItem.index]);

                    //remove the item from the array
                    transactionArray.splice(deleteItem.index, 1);
                }

                //call the function to update debit/credit totals once transaction is deleted
                updateTotals(transactionArray);

            });

        }
        
    });

    //Display error message
    function giveError(message){
        errorMsg.textContent = `${message}`;
    }

    //Update debit and credit totals
    function updateTotals(transactionArray)
    {
        let i = 0;
        let debitValue = 0;
        let creditValue = 0;

        //Going through all transactions
        while (i < transactionArray.length) {
            //If array item's payment type is debit, add that item's amount to the debitValue
            if (transactionArray[i].paymentType == 'debit') {
                debitValue += Number(transactionArray[i].amount);
            }
            //If array item's payment type is credit, add that item's amount to the creditValue
            else if (transactionArray[i].paymentType == 'credit') {
                creditValue += Number(transactionArray[i].amount);
            }
            i++;
        }

        //update displayed totals on page
        debitTotal.textContent = `$${debitValue.toFixed(2)}`;
        creditTotal.textContent = `$${creditValue.toFixed(2)}`;

        
    }

});