import { useState } from "react";
import "./App.css";
function App() {
  const [creditScore, setCreditScore] = useState("");
  const [geography, setGeography] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [tenure, setTenure] = useState("");
  const [balance, setBalance] = useState("");
  const [numOfProducts, setNumOfProducts] = useState("");
  const [hasCrCard, setHasCrCard] = useState("");
  const [isActiveMember, setIsActiveMember] = useState("");
  const [estimatedSalary, setEstimatedSalary] = useState("");
  const [satisfactionScore, setSatisfactionScore] = useState("");
  const [cardType, setCardType] = useState("");
  const [pointEarned, setPointEarned] = useState("");
  const [predictionResult, setPredictionResult] = useState("");
  const [churnProbability, setChurnProbability] = useState<number | null>(null);

  const predictChurn = async () => {
  const data = {
    CreditScore: Number(creditScore),
    Geography: geography,
    Gender: gender,
    Age: Number(age),
    Tenure: Number(tenure),
    Balance: Number(balance),
    NumOfProducts: Number(numOfProducts),
    HasCrCard: Number(hasCrCard),
    IsActiveMember: Number(isActiveMember),
    EstimatedSalary: Number(estimatedSalary),
    SatisfactionScore: Number(satisfactionScore),
    CardType: cardType,
    PointEarned: Number(pointEarned),
  };

  try {
    const response = await fetch("https://customer-churn-api-crdk.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    setPredictionResult(result.prediction);
    setChurnProbability(result.churn_probability);
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
  };

  return (
    <div className="app">

      <h1>Customer Churn Prediction</h1>

      <div className="content">

        <p className="description">
          Customer churn predictor basically predicts whether the customer is
          going to be a regular customer or not on the basis of data ofc this
          is created by Rishi HEHE
        </p>

        <div className="form">

          <label>Credit Score</label>
          <input
             type="number"
             value={creditScore}
             onChange={(e) => setCreditScore(e.target.value)}
                />

          <label>Geography</label>
          <select
            value={geography}
            onChange={(e) => setGeography(e.target.value)}
          >
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Spain">Spain</option>
          </select>

          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <label>Age</label>
          <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
         />

          <label>Tenure</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
          />

          <label>Balance</label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />

          <label>Number of Products</label>
          <input
            type="number"
            value={numOfProducts}
            onChange={(e) => setNumOfProducts(e.target.value)}
          />

          <label>Has Credit Card</label>
          <select
            value={hasCrCard}
            onChange={(e) => setHasCrCard(e.target.value)}
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>

          <label>Is Active Member</label>
          <select
            value={isActiveMember}
            onChange={(e) => setIsActiveMember(e.target.value)}
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>

          <label>Estimated Salary</label>
          <input 
            type="number" 
            value={estimatedSalary}
            onChange={(e) => setEstimatedSalary(e.target.value)}
          />

          <label>Satisfaction Score</label>
          <input 
            type="number" 
            value={satisfactionScore}
            onChange={(e) => setSatisfactionScore(e.target.value)}
          />

          <label>Card Type</label>
          <select
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          >
            <option value="">Select Card Type</option>
            <option value="DIAMOND">DIAMOND</option>
            <option value="GOLD">GOLD</option>
            <option value="PLATINUM">PLATINUM</option>
            <option value="SILVER">SILVER</option>
          </select>

          <label>Point Earned</label>
          <input 
            type="number" 
            value={pointEarned}
            onChange={(e) => setPointEarned(e.target.value)}
          />

          <button onClick={predictChurn}>Predict Churn</button>

          <div className="result">
          <h2>Prediction Result</h2>

          {predictionResult && (
            <>
              <p>
                {predictionResult}
              </p>

              <p>
                Churn Probability:{" "}
                <strong>
                  {churnProbability !== null
                    ? `${(churnProbability * 100).toFixed(2)}%`
                    : ""}
                </strong>
              </p>
            </>
          )}
        </div>

        
          

        </div>

      </div>

    </div>
  );
}

export default App;