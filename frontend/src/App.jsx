import { useEffect, useState } from 'react'
import './App.css'

const services = [
  {
    id: 1,
    name: 'Haircut',
    description: 'Klassisk klippning',
    price: '350 kr',
    duration: '30 min',
  },
  {
    id: 2,
    name: 'Beard Trim',
    description: 'Trimning och formning av skägg',
    price: '250 kr',
    duration: '20 min',
  },
  {
    id: 3,
    name: 'Haircut & Beard',
    description: 'Klippning + skägg',
    price: '500 kr',
    duration: '45 min',
  },
]

const barbers = ['Ahmed', 'Mohammed', 'Ali']

const times = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

function getWeekDays() {
  const days = []

  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + i)

    const dateString =
      `${date.getFullYear()}-` +
      `${String(date.getMonth() + 1).padStart(2, '0')}-` +
      `${String(date.getDate()).padStart(2, '0')}`

    days.push({
      date: dateString,
      dayName: date.toLocaleDateString('sv-SE', {
        weekday: 'short',
      }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('sv-SE', {
        month: 'short',
      }),
    })
  }

  return days
}

function App() {
  const [page, setPage] = useState('home')
  const [step, setStep] = useState(1)

  const [bookings, setBookings] = useState([])

  const [booking, setBooking] = useState({
    service: null,
    barber: '',
    date: '',
    time: '',
    customerName: '',
    customerEmail: '',
  })

  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [message, setMessage] = useState('')
const API_URL = import.meta.env.VITE_API_URL || ''
  const weekDays = getWeekDays()

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`)


      if (!response.ok) {
        throw new Error('Kunde inte hämta bokningar')
      }

      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error(error)
    }
  }

  const goToPage = (newPage) => {
    setPage(newPage)
    setMessage('')

    if (newPage === 'booking') {
      setStep(1)
      setConfirmedBooking(null)
    }
  }

  const selectService = (service) => {
    setBooking({
      ...booking,
      service,
    })
  }

  const selectBarber = (barber) => {
    setBooking({
      ...booking,
      barber,
    })
  }

  const selectDate = (date) => {
    setBooking({
      ...booking,
      date,
      time: '',
    })
  }

  const selectTime = (time) => {
    setBooking({
      ...booking,
      time,
    })
  }

  const isTimeBooked = (date, time) => {
    return bookings.some(
      (item) =>
        item.bookingDate === date &&
        item.bookingTime.startsWith(time)
    )
  }

  const continueToNextStep = () => {
    if (step === 1 && !booking.service) {
      setMessage('Välj en behandling först.')
      return
    }

    if (step === 2 && !booking.barber) {
      setMessage('Välj en barberare först.')
      return
    }

    if (step === 3 && (!booking.date || !booking.time)) {
      setMessage('Välj datum och tid först.')
      return
    }

    setMessage('')
    setStep(step + 1)
  }

  const goBack = () => {
    if (step > 1) {
      setMessage('')
      setStep(step - 1)
    }
  }

  const handleInputChange = (event) => {
    setBooking({
      ...booking,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('Bokningen sparas...')

    try {
    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          barber: booking.barber,
          service: booking.service.name,
          bookingDate: booking.date,
          bookingTime: `${booking.time}:00`,
        }),
      })

      if (!response.ok) {
        throw new Error('Bokningen kunde inte sparas.')
      }

      const savedBooking = await response.json()

      setConfirmedBooking(savedBooking)

      setMessage('')

      await loadBookings()
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="app">

      {/* HEADER */}

      <header className="site-header">
        <div className="header-inner">

          <button
            className="brand"
            onClick={() => goToPage('home')}
          >
            <img
              src="/diamond-logo.jpg"
              alt="Diamond Barbershop"
            />

            <div className="brand-text">
              <span>DIAMOND</span>
              <small>BARBERSHOP</small>
            </div>
          </button>

          <nav className="main-nav">

            <button onClick={() => goToPage('home')}>
              Hem
            </button>

            <button onClick={() => goToPage('services')}>
              Tjänster
            </button>

            <button onClick={() => goToPage('booking')}>
              Boka tid
            </button>

            <button onClick={() => goToPage('bookings')}>
              Mina bokningar
            </button>

            <button onClick={() => goToPage('contact')}>
              Kontakt
            </button>

          </nav>

          <button
            className="header-book-button"
            onClick={() => goToPage('booking')}
          >
            Boka tid
          </button>

          <button className="mobile-menu">
            ☰
          </button>

        </div>
      </header>

      {/* HOME */}

      {page === 'home' && (
        <main>

          <section className="hero">

            <div className="hero-content">

              <span className="hero-label">
                DIAMOND BARBERSHOP
              </span>

              <h1>
                Din stil.
                <br />
                <span>Din tid.</span>
              </h1>

              <p>
                Professionell barbering med personlig service.
              </p>

              <button
                className="hero-button"
                onClick={() => goToPage('booking')}
              >
                Boka din tid
              </button>

            </div>

          </section>

          <section className="home-section">

            <span className="section-label">
              DIAMOND EXPERIENCE
            </span>

            <h2>
              En enkel väg till din nästa look
            </h2>

            <div className="feature-grid">

              <div className="feature-card">
                <span>01</span>
                <h3>Välj behandling</h3>
                <p>
                  Välj den behandling som passar dig.
                </p>
              </div>

              <div className="feature-card">
                <span>02</span>
                <h3>Välj tid</h3>
                <p>
                  Se hela veckan och välj en ledig tid.
                </p>
              </div>

              <div className="feature-card">
                <span>03</span>
                <h3>Bekräfta</h3>
                <p>
                  Fyll i dina uppgifter och bekräfta.
                </p>
              </div>

            </div>

          </section>

        </main>
      )}

      {/* SERVICES */}

      {page === 'services' && (
        <main className="page-container">

          <div className="page-heading">
            <span className="section-label">
              DIAMOND BARBERSHOP
            </span>

            <h1>Våra tjänster</h1>

            <p>
              Välj den behandling som passar din stil.
            </p>
          </div>

          <div className="services-page-grid">

            {services.map((service) => (
              <div className="large-service-card" key={service.id}>

                <span className="service-number">
                  0{service.id}
                </span>

                <h2>{service.name}</h2>

                <p>{service.description}</p>

                <div className="service-bottom">
                  <span>{service.duration}</span>
                  <strong>{service.price}</strong>
                </div>

              </div>
            ))}

          </div>

          <div className="center-button">

            <button
              className="hero-button"
              onClick={() => goToPage('booking')}
            >
              Boka behandling
            </button>

          </div>

        </main>
      )}

      {/* BOOKING */}

      {page === 'booking' && (
        <main className="booking-container">

          {confirmedBooking ? (

            /* CONFIRMATION */

            <div className="confirmation-page">

              <div className="success-icon">
                ✓
              </div>

              <span className="section-label">
                DIAMOND BARBERSHOP
              </span>

              <h1>Bokningen är bekräftad</h1>

              <p>
                Vi ser fram emot att träffa dig.
              </p>

              <div className="confirmed-card">

                <div>
                  <span>Behandling</span>
                  <strong>
                    {confirmedBooking.service}
                  </strong>
                </div>

                <div>
                  <span>Barberare</span>
                  <strong>
                    {confirmedBooking.barber}
                  </strong>
                </div>

                <div>
                  <span>Datum</span>
                  <strong>
                    {confirmedBooking.bookingDate}
                  </strong>
                </div>

                <div>
                  <span>Tid</span>
                  <strong>
                    {confirmedBooking.bookingTime.substring(0, 5)}
                  </strong>
                </div>

              </div>

              <div className="confirmation-time">

                <span>DIN BOKADE TID</span>

                <strong>
                  {confirmedBooking.bookingDate}
                </strong>

                <b>
                  {confirmedBooking.bookingTime.substring(0, 5)}
                </b>

              </div>

              <button
                className="continue-button"
                onClick={() => goToPage('bookings')}
              >
                Visa mina bokningar
              </button>

            </div>

          ) : (

            /* BOOKING FLOW */

            <div className="booking-card">

              <div className="booking-header">

                <span className="section-label">
                  DIAMOND BARBERSHOP
                </span>

                <h1>Boka tid</h1>

                <p>
                  Välj behandling, barberare och tid.
                </p>

              </div>

              {/* STEPS */}

              <div className="steps">

                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                  <span>1</span>
                  <p>Behandling</p>
                </div>

                <div className="step-line" />

                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                  <span>2</span>
                  <p>Barberare</p>
                </div>

                <div className="step-line" />

                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                  <span>3</span>
                  <p>Tid</p>
                </div>

                <div className="step-line" />

                <div className={`step ${step >= 4 ? 'active' : ''}`}>
                  <span>4</span>
                  <p>Bekräfta</p>
                </div>

              </div>

              {message && (
                <div className="message">
                  {message}
                </div>
              )}

              {/* STEP 1 */}

              {step === 1 && (
                <section className="step-content">

                  <h2>Välj behandling</h2>

                  <p className="step-description">
                    Vad vill du boka?
                  </p>

                  <div className="service-list">

                    {services.map((service) => (

                      <button
                        className={`service-card ${
                          booking.service?.id === service.id
                            ? 'selected'
                            : ''
                        }`}
                        key={service.id}
                        onClick={() => selectService(service)}
                      >

                        <div className="service-info">

                          <h3>{service.name}</h3>

                          <p>{service.description}</p>

                          <span>
                            {service.duration}
                          </span>

                        </div>

                        <strong>
                          {service.price}
                        </strong>

                      </button>

                    ))}

                  </div>

                </section>
              )}

              {/* STEP 2 */}

              {step === 2 && (
                <section className="step-content">

                  <h2>Välj barberare</h2>

                  <p className="step-description">
                    Vem vill du boka hos?
                  </p>

                  <div className="barber-list">

                    {barbers.map((barber) => (

                      <button
                        className={`barber-card ${
                          booking.barber === barber
                            ? 'selected'
                            : ''
                        }`}
                        key={barber}
                        onClick={() => selectBarber(barber)}
                      >

                        <div className="barber-avatar">
                          {barber.charAt(0)}
                        </div>

                        <div>
                          <h3>{barber}</h3>
                          <p>Barberare</p>
                        </div>

                      </button>

                    ))}

                  </div>

                </section>
              )}

              {/* STEP 3 */}

              {step === 3 && (
                <section className="step-content">

                  <h2>Välj datum och tid</h2>

                  <p className="step-description">
                    Se hela veckans tillgängliga tider.
                  </p>

                  <div className="week-list">

                    {weekDays.map((day) => (

                      <div
                        className={`day-column ${
                          booking.date === day.date
                            ? 'selected-day'
                            : ''
                        }`}
                        key={day.date}
                      >

                        <button
  className="day-header"
  data-testid={`day-${day.date}`}
  onClick={() => selectDate(day.date)}
>
                          <span>
                            {day.dayName}
                          </span>

                          <strong>
                            {day.dayNumber}
                          </strong>

                          <small>
                            {day.month}
                          </small>
                        </button>

                        <div className="day-times">

                          {times.map((time) => {

                            const booked = isTimeBooked(
                              day.date,
                              time
                            )

                            const selected =
                              booking.date === day.date &&
                              booking.time === time

                            return (
                              <button
  key={time}
  disabled={booked}
  data-testid={`time-${day.date}-${time}`}
  className={`week-time ${selected ? 'selected' : ''} ${booked ? 'booked' : ''}`}
  onClick={() => {
    setBooking({
      ...booking,
      date: day.date,
      time,
    })
  }}
>
  {booked ? 'Bokad' : time}
</button>
                            )
                          })}

                        </div>

                      </div>

                    ))}

                  </div>

                </section>
              )}

              {/* STEP 4 */}

              {step === 4 && (
                <section className="step-content">

                  <h2>Bekräfta bokning</h2>

                  <p className="step-description">
                    Kontrollera din bokning.
                  </p>

                  <div className="confirmation">

                    <div>
                      <span>Behandling</span>
                      <strong>
                        {booking.service?.name}
                      </strong>
                    </div>

                    <div>
                      <span>Barberare</span>
                      <strong>
                        {booking.barber}
                      </strong>
                    </div>

                    <div>
                      <span>Datum</span>
                      <strong>
                        {booking.date}
                      </strong>
                    </div>

                    <div>
                      <span>Tid</span>
                      <strong>
                        {booking.time}
                      </strong>
                    </div>

                    <div>
                      <span>Pris</span>
                      <strong>
                        {booking.service?.price}
                      </strong>
                    </div>

                  </div>

                  <form
                    id="booking-form"
                    onSubmit={handleSubmit}
                  >

                    <label>Namn</label>

                    <input
                      className="text-input"
                      type="text"
                      name="customerName"
                      placeholder="Ditt namn"
                      value={booking.customerName}
                      onChange={handleInputChange}
                      required
                    />

                    <label>E-post</label>

                    <input
                      className="text-input"
                      type="email"
                      name="customerEmail"
                      placeholder="Din e-post"
                      value={booking.customerEmail}
                      onChange={handleInputChange}
                      required
                    />

                  </form>

                </section>
              )}

              {/* NAVIGATION */}

              <div className="navigation">

                {step > 1 ? (
                  <button
                    className="back-button"
                    onClick={goBack}
                  >
                    ← Tillbaka
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    className="continue-button"
                    onClick={continueToNextStep}
                  >
                    Fortsätt →
                  </button>
                ) : (
                  <button
                    className="continue-button"
                    type="submit"
                    form="booking-form"
                  >
                    Bekräfta bokning
                  </button>
                )}

              </div>

            </div>
          )}

        </main>
      )}

      {/* BOOKINGS */}

      {page === 'bookings' && (
        <main className="page-container">

          <div className="page-heading">

            <span className="section-label">
              DIAMOND BARBERSHOP
            </span>

            <h1>Mina bokningar</h1>

            <p>
              Här ser du dina bokade tider.
            </p>

          </div>

          {bookings.length === 0 ? (

            <div className="empty-bookings">
              <h2>Inga bokningar ännu</h2>

              <p>
                Boka din första tid hos Diamond Barbershop.
              </p>

              <button
                className="hero-button"
                onClick={() => goToPage('booking')}
              >
                Boka tid
              </button>
            </div>

          ) : (

            <div className="booking-history">

              {bookings.map((item) => (

                <div
                  className="history-card"
                  key={item.id}
                >

                  <div className="history-date">

                    <span>
                      {item.bookingDate}
                    </span>

                    <strong>
                      {item.bookingTime.substring(0, 5)}
                    </strong>

                  </div>

                  <div className="history-info">

                    <h3>{item.service}</h3>

                    <p>
                      Barberare: {item.barber}
                    </p>

                    <p>
                      {item.customerName}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </main>
      )}

      {/* CONTACT */}

      {page === 'contact' && (
        <main className="page-container">

          <div className="page-heading">

            <span className="section-label">
              DIAMOND BARBERSHOP
            </span>

            <h1>Kontakta oss</h1>

            <p>
              Vi hjälper dig gärna.
            </p>

          </div>

          <div className="contact-grid">

            <div className="contact-card">
              <span>ADRESS</span>
              <h3>Stockholm</h3>
              <p>
                Besök oss för din nästa klippning.
              </p>
            </div>

            <div className="contact-card">
              <span>TELEFON</span>
              <h3>08-123 45 67</h3>
              <p>
                Ring oss under våra öppettider.
              </p>
            </div>

            <div className="contact-card">
              <span>E-POST</span>
              <h3>info@diamondbarbershop.se</h3>
              <p>
                Vi svarar så snart vi kan.
              </p>
            </div>

          </div>

        </main>
      )}

      <footer className="footer">

        <div className="footer-logo">
          DIAMOND
          <span>BARBERSHOP</span>
        </div>

        <p>
          © 2026 Diamond Barbershop
        </p>

      </footer>

    </div>
  )
}

export default App