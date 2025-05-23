export default function Error({ err = "Något gick fel." }: { err?: string }) {
    return (
        <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            {err}
        </div>
    );
}
