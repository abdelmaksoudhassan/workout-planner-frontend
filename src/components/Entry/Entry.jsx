import "./entry.css"

export default function Entry({date='',meals=[],routines=[],element}){

    function formatDate(dateString) {

        const date = new Date(dateString);

        const day = date.getDate().toString()
        const month = (date.getMonth() + 1).toString()
        const year = date.getFullYear().toString();


        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate;
    }

    function getDiffDate(date){
        const firstDate = new Date(date)
        const secondDate = new Date()
        const millisecondsDiff = firstDate.getTime() - secondDate.getTime()
        const daysDiff = Math.round(
            millisecondsDiff / (24 * 60 * 60 * 1000)
        )
        return daysDiff === 0 ?
         'Deadline today' :
          daysDiff > 0 ? `Exercise after ${daysDiff} days` : `Exercise done ${-daysDiff} days ago`  
    }

    return <>
        <div className="entryItem">
            <h1>{formatDate(date)}</h1>
            <h2>Meals taken</h2>
            <div className="mealsContainer">
                {meals?.map((m, i) => (
                    <div className="mealItem" key={i}>{m.name}</div>
                ))}
            </div>
            <h4>{getDiffDate(date)}</h4>
            <div className="mealsContainer">
                {routines?.map((r, j) => (
                    <div className="mealItem" key={j}>{r.name}</div>
                ))}
            </div>
            {element}
        </div>
    </>
}