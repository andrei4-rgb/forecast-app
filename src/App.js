import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

export default function ForecastApp() {
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const temp = [];
      for (let i = 1; i <= 100; i++) {
        temp.push({
          id: i,
          name: "Product " + i,
          inventory: Math.floor(Math.random() * 50),
          avgSales: Math.floor(Math.random() * 70) + 10,
          leadTime: Math.floor(Math.random() * 7) + 1,
        });
      }
      setProducts(temp);
    };
    fetchProducts();
  }, []);

  const handlePredict = async () => {
    const trainingData = tf.tensor2d([
      [20, 50, 3],
      [5, 30, 5],
      [15, 40, 4],
      [8, 60, 2],
    ]);
    const outputData = tf.tensor2d([[0], [1], [0], [1]]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [3], units: 8, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

    model.compile({
      optimizer: "adam",
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    await model.fit(trainingData, outputData, {
      epochs: 200,
      shuffle: true,
    });

    const newSuggestions = [];
    for (let p of products) {
      const input = tf.tensor2d([[p.inventory, p.avgSales, p.leadTime]]);
      const result = model.predict(input);
      const value = (await result.data())[0];
      if (value > 0.5) {
        newSuggestions.push(p);
      }
    }
    setSuggestions(newSuggestions);
  };

return (
  <div style={{ padding: 20 }}>
    <h2>Inventory Reorder Dashboard</h2>
    <button onClick={handlePredict}>Run Forecast</button>

    <h3>Products Needing Reorder:</h3>
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", marginTop: 10 }}>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Stock</th>
          <th>Sales/week</th>
          <th>Lead Time (days)</th>
        </tr>
      </thead>
      <tbody>
        {suggestions.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.inventory}</td>
            <td>{p.avgSales}</td>
            <td>{p.leadTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}