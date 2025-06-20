import React, { useEffect, useState } from "react";
import "./App.css";
import FilterPanel from "./components/FilterPanel";
import ChartAll from "./components/ChartAll";
import ChartClimate from "./components/ChartClimate";
import ChartTemp from "./components/ChartTemp";
import ChartSunlight from "./components/ChartSunlight";

function App() {
  const [data, setData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedYear, setSelectedYear] = useState(""); // 연도 필터 state 추가
  const [selectedMonth, setSelectedMonth] = useState("");
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || ""
  );
  const [rainValue, setRainValue] = useState("");
  const [temperatureValue, setTemperatureValue] = useState("");
  const [sunlightValue, setSunlightValue] = useState("");
  const [volumeValue, setVolumeValue] = useState("");

  useEffect(() => {
  // 닉네임이 있든 없든, 일단 더미 데이터로 set!
  const dummy = [
    { product: "배추", price: 980, volume: 1200, month: "2024-06", rain: 20, temperature: 18, sunlight: 5 },
    { product: "배추", price: 990, volume: 1230, month: "2024-07", rain: 15, temperature: 21, sunlight: 6 },
    { product: "무", price: 700, volume: 900, month: "2024-06", rain: 23, temperature: 17, sunlight: 5 }
  ];
  setData(dummy);
  setSelectedProduct(dummy[0].product);
  setSelectedYear(dummy[0].month.slice(0, 4));
  setSelectedMonth(dummy[0].month);
}, [nickname]);

  const allMonths = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  if (!data) return <p>데이터 불러오는 중...</p>;

  // 상품, 연도, 월 목록 뽑기
  const products = Array.from(new Set(data.map((row) => row.product)));
  const years = Array.from(new Set(data.map((row) => row.month.slice(0, 4))));
  // 연-월 목록: 선택된 연도에 해당하는 월만 필터링
  // App.js
  const months = Array.from(
    new Set(
      data
        .filter(
          (row) =>
            row.product === selectedProduct &&
            row.month.startsWith(selectedYear)
        )
        .map((row) => {
          // 무조건 두 자리로 맞추기!
          return row.month.slice(5, 7).padStart(2, "0");
        }) // 반드시 5~7자리, 즉 "03", "11", "12" 추출
    )
  ).sort();

  // 선택 조건에 맞는 데이터 찾기
  const target = data.find(
    (row) => row.product === selectedProduct && row.month === selectedMonth
  );
  const filteredData = data.filter(
    (row) => row.product === selectedProduct && row.month === selectedMonth
  );
  function NicknameInput({ nickname, setNickname }) {
    const [value, setValue] = useState(nickname || "");

    const handleSubmit = (e) => {
      e.preventDefault();
      setNickname(value);
      localStorage.setItem("nickname", value);
    };

    return (
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="닉네임(별명)을 입력하세요"
          style={{ fontSize: 16, padding: 6, borderRadius: 6 }}
          required
        />
        <button type="submit" style={{ marginLeft: 10 }}>
          확인
        </button>
      </form>
    );
  }
  if (!nickname) {
    return <NicknameInput nickname={nickname} setNickname={setNickname} />;
  }
  function LogViewer() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
  setLogs([]); // 로그 없음 처리
}, []);


    // 날짜 포맷 예쁘게 함수
    const formatTime = (time) => {
      const t = new Date(time);
      // yyyy-mm-dd HH:MM
      return t.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontWeight: "bold" }}>최근 사용 내역</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            maxHeight: 240,
            overflowY: "auto",
          }}
        >
          {logs.length === 0 ? (
            <span style={{ color: "#888" }}>최근 조회 기록이 없습니다.</span>
          ) : (
            logs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: "10px 18px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.09)",
                  fontSize: 14,
                  color: "#222",
                  borderLeft: "4px solid",
                }}
              >
                <div>
                  <b>{formatTime(log.time)}</b>에 조회함
                </div>
                {/* ip나 url은 관리자만 보는 용도라면 빼도 OK */}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  function handlePredict() {
  // 실제 예측은 불가 → 안내문구 표시
  alert("백엔드 서버(Flask)가 연결되어 있지 않아 예측이 불가능합니다.");
}

  return (
    <div className="app-container">
      {/* 1. 필터 영역 (카드 스타일) */}
      <div className="filter-wrapper">
        <div className="filter-panel">
          <FilterPanel
            products={products}
            years={years}
            months={allMonths}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
      </div>

      {/* 2. 차트 2열 */}
      <div className="charts">
        <div className="card chart-card">
          <ChartAll
            target={target}
            selectedProduct={selectedProduct}
            selectedMonth={selectedMonth}
          />
        </div>
        <div className="card chart-card">
          <ChartClimate
            filteredData={filteredData}
            selectedProduct={selectedProduct}
          />
        </div>
        <div className="card chart-card">
          <ChartTemp
            filteredData={filteredData}
            selectedProduct={selectedProduct}
          />
        </div>
        <div className="card chart-card">
          <ChartSunlight
            filteredData={filteredData}
            selectedProduct={selectedProduct}
          />
        </div>
      </div>

      {/* 3. 로그 */}
      <div className="card log-viewer">
        <LogViewer />
      </div>

      {/* 4. 예측 입력 폼 */}
      <div className="card predict-form">
        <h3>예측용 입력값</h3>
        <label>
          강수량:
          <input
            value={rainValue}
            onChange={(e) => setRainValue(e.target.value)}
          />
        </label>
        <label>
          기온:
          <input
            value={temperatureValue}
            onChange={(e) => setTemperatureValue(e.target.value)}
          />
        </label>
        <label>
          일조량:
          <input
            value={sunlightValue}
            onChange={(e) => setSunlightValue(e.target.value)}
          />
        </label>
        <label>
          거래량:
          <input
            value={volumeValue}
            onChange={(e) => setVolumeValue(e.target.value)}
          />
        </label>
        <button onClick={handlePredict}>예측하기</button>
      </div>
    </div>
  );
}

export default App;
