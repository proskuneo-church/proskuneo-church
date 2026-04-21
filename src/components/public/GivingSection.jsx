import { givingInfo } from "../../data/siteContent";

export default function GivingSection() {
  return (
    <section className="section section-dark" id="giving">
      <div className="site-container giving-layout">
        <div>
          {/*<p className="eyebrow">Giving</p>*/}
          <h2>Giving with Trust and Joy</h2>
          <p>
            Ambil bagian dalam pelayanan melalui dukungan yang Anda berikan.
          </p>
          <div className="account-box">
            <p>{givingInfo.account}</p>
            <p>{givingInfo.holder}</p>
          </div>
          <p className="trust-text">{givingInfo.message}</p>
        </div>

        <img src={givingInfo.qris} alt="QRIS Proskuneo Church" className="qris-main" />
      </div>
    </section>
  );
}
