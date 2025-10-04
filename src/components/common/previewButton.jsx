const PreviewButton = ({ showDetail }) => {
    return (
        <button
            onClick={showDetail}
            className="btn text-sm md:text-base px-4 py-2 rounded-lg shadow-lg button h-auto min-h-[44px] border no-hover flex items-center gap-2"
        >
            Preview
        </button>
    );
};

export default PreviewButton;