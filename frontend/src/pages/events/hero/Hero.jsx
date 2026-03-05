import React from 'react';
import './hero.css';

const Hero = ({ query, setQuery, location, setLocation, quotes }) => {
  return (
    <section className="events-hero">
      <div className="events-hero-inner">
        <h2 className="hero-title">Explore the world of events</h2>
        <div className="rotating-quote" aria-hidden>
          <div className="quote-clip">
            {quotes.map((q, i) => (
              <span key={i} className={`quote`}>{q}</span>
            ))}
          </div>
        </div>

        <div className="search-row">
          <div className="search-input">
            <span className="search-icon">🔍</span>
            <input placeholder="Search Events, Categories, Location..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="search-location">
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Australia</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
