export const Component = () => (
	<>
		<title>Planner - Info</title>
		<div className="flex flex-col gap-4">
			<h1 className="text-3xl font-semibold">Info</h1>
			<p>
				This project is a small app that I&apos;ve used to play with Tokenami. I wanted to experiment with this
				interesting library to get to know it better so I can compare it against other styling solutions that I used.
				Moreover, I also wanted to use it to benchmark Tokenami selectors performance, because it uses substring
				attribute selectors, which are known for worse performance than e.g. class selectors.
			</p>
			<p>
				More details you can read in this repository:{" "}
				<a
					className="rounded-sm underline outline-2 outline-offset-2 outline-blue-8 focus-visible:outline"
					href="http://github.com/pawelblaszczyk5/planner-tokenami"
					rel="noreferrer"
				>
					Planner Tokenami GitHub
				</a>
			</p>
		</div>
	</>
);

Component.displayName = "InfoView";
