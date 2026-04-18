import { givingInfo } from "../data/siteData";

export default function GivingSection() {
  return (
    <section className="section" id="giving">
      <div className="container">
        <div className="giving-panel">
          <div>
            <h2 className="giving-title">Persembahan</h2>
            <p className="giving-text">
              Dukungan Anda membantu pelayanan gereja menjangkau lebih banyak jiwa setiap minggu.
            </p>

            <div className="bank-box">
              <p className="bank-label">Transfer Bank</p>
              <p className="bank-account">
                {givingInfo.bankName} {givingInfo.accountNumber}
              </p>
              <p className="bank-label">{givingInfo.accountName}</p>
            </div>

            <p className="giving-message">{givingInfo.message}</p>
          </div>

          <img src={givingInfo.qrisImage} alt="QRIS Proskuneo Church" className="qris-image" />
        </div>
      </div>
    </section>
  );
}

