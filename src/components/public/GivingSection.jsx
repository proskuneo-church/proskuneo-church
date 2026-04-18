import { givingInfo } from "../../data/siteContent";

export default function GivingSection() {
  return (
    <section className="section section-dark" id="giving">
      <div className="site-container giving-layout">
        <div>
          <p className="eyebrow">Persembahan</p>
          <h2>Giving with Trust and Joy</h2>
          <p>
            Persembahan Anda mendukung pelayanan ibadah, pemuridan, serta jangkauan misi gereja.
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
