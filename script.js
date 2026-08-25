/* =========================================================
   SAMSUNG INCENTIVE CALCULATOR
   JavaScript Version
========================================================= */


/* =========================================================
   MODEL MASTER
========================================================= */

const models = [

    "FOLD8 ULTRA",
    "FOLD8",
    "FLIP8",
    "FOLD7",

    "S26 ULTRA",
    "S26+",
    "S26",

    "S25 ULTRA",
    "S25 Edge",
    "S25",
    "S25 FE",

    "A57",
    "A37",
    "A27",
    "A36",
    "A26",
    "A17",
    "A07 5G",

    "F17",

    "NPC",
    "TABLETS",
    "WEARABLES",

    "Grand Total",
    "Protect Max",
    "Total"

];


/* =========================================================
   DEFAULT INCENTIVE RATES
========================================================= */

let rates = {

    "FOLD8 ULTRA":5000,
    "FOLD8":4000,
    "FLIP8":3000,
    "FOLD7":2500,

    "S26 ULTRA":2500,
    "S26+":1800,
    "S26":1500,

    "S25 ULTRA":2000,
    "S25 Edge":1500,
    "S25":1000,
    "S25 FE":800,

    "A57":500,
    "A37":450,
    "A27":400,
    "A36":350,
    "A26":300,
    "A17":250,
    "A07 5G":200,

    "F17":250,

    "NPC":0,
    "TABLETS":500,
    "WEARABLES":300,

    "Grand Total":0,
    "Protect Max":0,
    "Total":0

};


/* =========================================================
   LOAD SAVED RATES
========================================================= */

const savedRates =
    localStorage.getItem(
        "samsung_incentive_rates"
    );


if(savedRates){

    try{

        rates =
            JSON.parse(savedRates);

    }
    catch(error){

        console.log(
            "Rates loading error"
        );

    }

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const today =
            new Date();


        /* DATE */

        document.getElementById(
            "calcDate"
        ).value =
            today
            .toISOString()
            .split("T")[0];


        /* DISPLAY DATE */

        document.getElementById(
            "displayDate"
        ).innerText =
            today.toLocaleDateString(
                "en-IN"
            );


        /* MONTH */

        document.getElementById(
            "month"
        ).value =
            today
            .toISOString()
            .slice(0,7);


        /* MASTER */

        renderMaster();


        /* FIRST ROW */

        addRow();


        /* CALCULATE */

        calculate();

    }
);


/* =========================================================
   ADD CALCULATION ROW
========================================================= */

function addRow(){

    const tbody =
        document.getElementById(
            "calculationBody"
        );


    const tr =
        document.createElement(
            "tr"
        );


    tr.innerHTML = `

        <td class="sr"></td>

        <td>

            <select
                class="model-select"
                onchange="modelChanged(this)">

                <option value="">
                    Select Model
                </option>

                ${models.map(
                    model => `

                    <option value="${model}">
                        ${model}
                    </option>

                `
                ).join("")}

            </select>

        </td>


        <td>

            <input
                type="number"
                min="0"
                value="0"
                class="qty-input"
                oninput="calculate()">

        </td>


        <td>

            <input
                type="number"
                min="0"
                value="0"
                class="incentive-input"
                oninput="calculate()">

        </td>


        <td class="final-value">
            ₹0
        </td>


        <td>

            <button
                class="remove-btn"
                onclick="removeRow(this)">
                ×
            </button>

        </td>

    `;


    tbody.appendChild(tr);


    updateSerialNumbers();

}


/* =========================================================
   MODEL CHANGE
========================================================= */

function modelChanged(select){

    const row =
        select.closest("tr");


    const incentiveInput =
        row.querySelector(
            ".incentive-input"
        );


    const model =
        select.value;


    if(model){

        incentiveInput.value =
            rates[model] ?? 0;

    }
    else{

        incentiveInput.value =
            0;

    }


    calculate();

}


/* =========================================================
   REMOVE ROW
========================================================= */

function removeRow(button){

    const tbody =
        document.getElementById(
            "calculationBody"
        );


    if(
        tbody.children.length <= 1
    ){

        showToast(
            "At least one row is required"
        );

        return;

    }


    button
        .closest("tr")
        .remove();


    updateSerialNumbers();

    calculate();

}


/* =========================================================
   SERIAL NUMBERS
========================================================= */

function updateSerialNumbers(){

    document
        .querySelectorAll(
            "#calculationBody tr"
        )
        .forEach(
            (row,index)=>{

                row.querySelector(
                    ".sr"
                ).innerText =
                    index + 1;

            }
        );

}


/* =========================================================
   CALCULATE
========================================================= */

function calculate(){

    let totalQty = 0;

    let totalIncentive = 0;

    let modelCount = 0;


    document
        .querySelectorAll(
            "#calculationBody tr"
        )
        .forEach(
            row=>{

                const model =
                    row.querySelector(
                        ".model-select"
                    ).value;


                const qty =
                    parseFloat(
                        row.querySelector(
                            ".qty-input"
                        ).value
                    ) || 0;


                const incentive =
                    parseFloat(
                        row.querySelector(
                            ".incentive-input"
                        ).value
                    ) || 0;


                const finalValue =
                    qty * incentive;


                row.querySelector(
                    ".final-value"
                ).innerText =
                    formatCurrency(
                        finalValue
                    );


                if(
                    model &&
                    qty > 0
                ){

                    modelCount++;

                }


                totalQty += qty;

                totalIncentive +=
                    finalValue;

            }
        );


    /* TOTAL MODELS */

    document.getElementById(
        "totalModels"
    ).innerText =
        modelCount;


    /* TOTAL QTY */

    document.getElementById(
        "totalQty"
    ).innerText =
        totalQty;


    /* TOTAL INCENTIVE */

    document.getElementById(
        "totalIncentive"
    ).innerText =
        formatCurrency(
            totalIncentive
        );


    /* FOOTER QTY */

    document.getElementById(
        "footerQty"
    ).innerText =
        totalQty;


    /* FOOTER TOTAL */

    document.getElementById(
        "footerTotal"
    ).innerText =
        formatCurrency(
            totalIncentive
        );

}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(value){

    return "₹" +
        Number(value)
        .toLocaleString(
            "en-IN",
            {
                maximumFractionDigits:0
            }
        );

}


/* =========================================================
   MASTER TABLE
========================================================= */

function renderMaster(){

    const tbody =
        document.getElementById(
            "masterBody"
        );


    tbody.innerHTML = "";


    models.forEach(
        (model,index)=>{

            const tr =
                document.createElement(
                    "tr"
                );


            tr.setAttribute(
                "data-model",
                model.toLowerCase()
            );


            tr.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td class="model-name">
                    ${model}
                </td>


                <td>

                    <input
                        type="number"
                        min="0"
                        value="${rates[model] ?? 0}"
                        data-rate-model="${model}"
                        disabled>

                </td>

            `;


            tbody.appendChild(tr);

        }
    );

}


/* =========================================================
   EDIT MASTER
========================================================= */

function toggleMaster(){

    const card =
        document.getElementById(
            "masterCard"
        );


    const saveButton =
        document.getElementById(
            "saveMasterBtn"
        );


    card.classList.toggle(
        "hidden"
    );


    saveButton.classList.toggle(
        "hidden"
    );


    document
        .querySelectorAll(
            "[data-rate-model]"
        )
        .forEach(
            input=>{

                input.disabled =
                    card.classList.contains(
                        "hidden"
                    );

            }
        );

}


/* =========================================================
   SAVE MASTER
========================================================= */

function saveMaster(){

    document
        .querySelectorAll(
            "[data-rate-model]"
        )
        .forEach(
            input=>{

                const model =
                    input.dataset.rateModel;


                rates[model] =
                    parseFloat(
                        input.value
                    ) || 0;

            }
        );


    localStorage.setItem(
        "samsung_incentive_rates",
        JSON.stringify(rates)
    );


    showToast(
        "Incentive rates saved successfully"
    );


    calculate();

}


/* =========================================================
   SEARCH MASTER
========================================================= */

function searchMaster(){

    const search =
        document
        .getElementById(
            "masterSearch"
        )
        .value
        .toLowerCase();


    document
        .querySelectorAll(
            "#masterBody tr"
        )
        .forEach(
            row=>{

                const model =
                    row.dataset.model;


                row.style.display =
                    model.includes(search)
                    ? ""
                    : "none";

            }
        );

}


/* =========================================================
   SAVE CALCULATION
========================================================= */

function saveCalculation(){

    calculate();


    const data = {

        employee:
            document.getElementById(
                "employeeName"
            ).value,

        store:
            document.getElementById(
                "storeName"
            ).value,

        month:
            document.getElementById(
                "month"
            ).value,

        date:
            document.getElementById(
                "calcDate"
            ).value,

        rows: []

    };


    document
        .querySelectorAll(
            "#calculationBody tr"
        )
        .forEach(
            row=>{

                const model =
                    row.querySelector(
                        ".model-select"
                    ).value;


                const qty =
                    parseFloat(
                        row.querySelector(
                            ".qty-input"
                        ).value
                    ) || 0;


                const incentive =
                    parseFloat(
                        row.querySelector(
                            ".incentive-input"
                        ).value
                    ) || 0;


                if(model){

                    data.rows.push({

                        model:model,

                        qty:qty,

                        incentive:incentive,

                        final:
                            qty * incentive

                    });

                }

            }
        );


    localStorage.setItem(
        "last_incentive_calculation",
        JSON.stringify(data)
    );


    showToast(
        "Calculation saved successfully"
    );

}


/* =========================================================
   RESET
========================================================= */

function resetCalculation(){

    if(
        !confirm(
            "Are you sure you want to reset calculation?"
        )
    ){

        return;

    }


    document.getElementById(
        "employeeName"
    ).value = "";


    document.getElementById(
        "storeName"
    ).value = "";


    const tbody =
        document.getElementById(
            "calculationBody"
        );


    tbody.innerHTML = "";


    addRow();


    calculate();


    showToast(
        "Calculation reset"
    );

}


/* =========================================================
   EXPORT CSV / EXCEL
========================================================= */

function exportCSV(){

    let csv =
        "SR NO,MODEL,QTY,MODEL WISE INCENTIVE,FINAL INCENTIVE\n";


    document
        .querySelectorAll(
            "#calculationBody tr"
        )
        .forEach(
            (row,index)=>{

                const model =
                    row.querySelector(
                        ".model-select"
                    ).value;


                const qty =
                    row.querySelector(
                        ".qty-input"
                    ).value;


                const incentive =
                    row.querySelector(
                        ".incentive-input"
                    ).value;


                const finalValue =
                    (
                        parseFloat(qty) || 0
                    ) *
                    (
                        parseFloat(incentive) || 0
                    );


                if(model){

                    csv +=
                        `${index+1},"${model}",${qty},${incentive},${finalValue}\n`;

                }

            }
        );


    const rows =
        document.querySelectorAll(
            "#calculationBody tr"
        );


    let total = 0;


    rows.forEach(
        row=>{

            const qty =
                parseFloat(
                    row.querySelector(
                        ".qty-input"
                    ).value
                ) || 0;


            const incentive =
                parseFloat(
                    row.querySelector(
                        ".incentive-input"
                    ).value
                ) || 0;


            total +=
                qty * incentive;

        }
    );


    csv +=
        `\n,,,GRAND TOTAL,${total}`;


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;


    link.download =
        "Samsung_Incentive_Report.csv";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Excel file exported"
    );

}


/* =========================================================
   DARK MODE
========================================================= */

function toggleDarkMode(){

    document.body.classList.toggle(
        "dark"
    );


    localStorage.setItem(
        "dark_mode",
        document.body.classList.contains(
            "dark"
        )
    );

}


/* =========================================================
   LOAD DARK MODE
========================================================= */

if(
    localStorage.getItem(
        "dark_mode"
    ) === "true"
){

    document.body.classList.add(
        "dark"
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message){

    const toast =
        document.getElementById(
            "toast"
        );


    toast.innerText =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        ()=>{
            toast.classList.remove(
                "show"
            );
        },
        2500
    );

}