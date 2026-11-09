const Text = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-14 md:px-8 md:pt-20">
      <h2 className="font-(family-name:--font-playfair) text-4xl font-bold leading-tight tracking-tight text-[#292521] md:text-6xl">
        Shop by category
      </h2>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#292521]/15 pt-4 text-sm text-[#292521]/70 md:text-base">
        <p className="font-(family-name:--font-lato) flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Find your perfect style
        </p>

        <p className="font-(family-name:--font-playfair)">
          Men, Women, Kids
        </p>
      </div>
    </div>
  );
};

export default Text;