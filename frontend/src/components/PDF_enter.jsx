export default function PDFenter() {
    return (
        <div className="input_box">
            <h1 className="heading">PDF Enter</h1>
            <p className="input_label">Upload your PDF file here.</p>
            <input type="file" accept=".pdf" onChange={(event) => this.setState({ selectedFile: event.target.files[0] })} />
            <button className="submit_btn" type="submit">Submit</button>
        </div>
    )
}
