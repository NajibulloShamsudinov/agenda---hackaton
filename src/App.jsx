import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "./App.css";

/* ===== AGENDA DAY 1 ===== */
const agendaDay1 = [
  { time: "08:30", title: "Регистрация участников", speaker: "Networking" },
  {
    time: "09:30",
    title: "Открытие хакатона и цели мероприятия",
    speaker: "Ориенбанк • SoftClub • IT Park • UNDP",
  },
  { time: "09:50", title: "AI в реальном бизнесе", speaker: "Мустафо Файзов" },
  { time: "10:00", title: "Просмотр вдохновляющих видео", speaker: "" },
  {
    time: "10:10",
    title: "Prompt Engineering и автоматизация",
    speaker: "Рустам Гулов",
  },
  {
    time: "10:30",
    title: "Презентация кейсов компаний и анонсирование команд",
    speaker: "Нурулло Сулаймонов",
  },
  { time: "10:45", title: "Кофе-брейк ☕", speaker: "" },
  { time: "11:00", title: "Начало разработки проектов", speaker: "Workshop" },
  { time: "15:00", title: "Менторский чекпоинт", speaker: "Mentors" },
  {
    time: "17:00",
    title: "Продолжение работы над проектами",
    speaker: "Workshop",
  },
  { time: "21:00", title: "Завершение первого дня", speaker: "Networking" },
];

/* ===== AGENDA DAY 2 ===== */
const agendaDay2 = [
  {
    time: "09:00",
    title: "Продолжение работы над проектами",
    speaker: "Workshop",
  },
  {
    time: "11:00",
    title: "Менторские консультации и финальная доработка",
    speaker: "Mentors",
  },
  {
    time: "15:00",
    title: "Подготовка презентаций и демо",
    speaker: "Workshop",
  },
  { time: "16:30", title: "Финальные презентации команд", speaker: "Спикеры" },
  { time: "17:30", title: "Обсуждение результатов жюри", speaker: "Жюри" },
  {
    time: "18:00",
    title: "Награждение и закрытие хакатона",
    speaker: "Networking",
  },
];

/* ===== HELPERS ===== */
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function getCurrentAndNext(list, now) {
  const nowM = now.hour() * 60 + now.minute();
  let current = null;
  let next = null;

  for (let i = 0; i < list.length; i++) {
    const start = toMinutes(list[i].time);
    const end = list[i + 1] ? toMinutes(list[i + 1].time) : Infinity;

    if (nowM >= start && nowM < end) {
      current = list[i];
      next = list[i + 1] || null;
      break;
    }
  }

  if (!current) {
    next = list.find((e) => toMinutes(e.time) > nowM) || null;
  }

  return { current, next };
}

/* ===== APP ===== */
export default function App() {
  const [now, setNow] = useState(dayjs());
  const [day, setDay] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const agenda = day === 1 ? agendaDay1 : agendaDay2;
  const { current, next } = useMemo(
    () => getCurrentAndNext(agenda, now),
    [agenda, now]
  );

  return (
    <div className="screen">
      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="badge">LIVE</div>
          <div>
            <div className="title">Build with AI - Hackathon</div>
            {/* <div className="subtitle">Время местное (GMT+5)</div> */}
          </div>
        </div>

        <div className="clock">
          <div className="time">{now.format("HH:mm:ss")}</div>

          {/* DAY SWITCH */}
          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            <button
              onClick={() => setDay(1)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.3)",
                background: day === 1 ? "rgba(34,197,94,0.25)" : "transparent",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              DAY 1
            </button>
            <button
              onClick={() => setDay(2)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.3)",
                background: day === 2 ? "rgba(124,58,237,0.35)" : "transparent",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              DAY 2
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="main">
        {/* CURRENT */}
        <section className="card card-now">
          <div className="cardTop">
            <span className="chip chip-now">СЕЙЧАС</span>
            {current?.time && (
              <span className="chip chip-time">{current.time}</span>
            )}
          </div>

          <div className="cardTitle">{current?.title || "Ожидание начала"}</div>

          {current?.speaker ? (
            <div className="cardSpeaker">🎤 {current.speaker}</div>
          ) : (
            <div className="cardSpeaker dim">—</div>
          )}
        </section>

        {/* NEXT */}
        <section className="card card-next">
          <div className="cardTop">
            <span className="chip chip-next">ДАЛЕЕ</span>
            {next?.time && <span className="chip chip-time">{next.time}</span>}
          </div>

          <div className="cardTitle small">{next?.title || "—"}</div>

          {next?.speaker ? (
            <div className="cardSpeaker">🎤 {next.speaker}</div>
          ) : (
            <div className="cardSpeaker dim">—</div>
          )}
        </section>
      </main>

      {/* TIMELINE */}
      <footer className="timeline">
        {agenda.map((e, i) => {
          const isCurrent = e.time === current?.time;
          return (
            <div key={i} className={`tick ${isCurrent ? "active" : ""}`}>
              <div className="tickTime">{e.time}</div>
              <div className="tickDot" />
              <div className="tickText">{e.title}</div>
            </div>
          );
        })}
      </footer>
    </div>
  );
}
