import Navbar from "./Navbar";
import { Link } from "react-router-dom";

export default function HowToPlay() {
  return (
    <div className="font-quicksand">
      <Navbar></Navbar>

      <div className="w-fit mx-auto curs">
        <Link to="/">
          <div className="text-green-300 w-fit mx-auto">home</div>
        </Link>
      </div>

      <div className="text-green-600 text-left p-5">
        <div>
          <h1 className="text-4xl font-semibold">about game</h1>
          <p className="text-xl mt-3 text-yellow-600 tracking-wide">
            Welcome to GuessSketch! This fun and engaging game is perfect for
            testing your drawing and guessing skills. Here is a step-by-step
            guide on how to play the game.
          </p>
        </div>

        <div className="mt-10">
          <h1 className="text-3xl font-semibold">creating or joining a room</h1>
          <ul className="list-disc px-7 mt-3 text-lg text-yellow-600 tracking-wide">
            <li>
              When you open GuessSketch, you can create a new room. Choose a
              room name and set the number of rounds you want to play (default
              is 2 rounds).
            </li>
            <li>
              Your friends can join the room using the room name and password
              which you provide them.
            </li>
            <li>
              Rooms have maximum capacity, and once filled, the game
              automatically starts.
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <h1 className="text-3xl font-semibold">game mechanics</h1>
          <ul className="list-disc px-7 mt-3 text-lg text-yellow-600 tracking-wide">
            <li>
              Each game consists of 2 rounds by default(you can customize this
              when creating the room).
            </li>
            <li>
              In each round, a player takes turn to draw a word assigned to
              them.
            </li>
            <li>While one player draws, other guess the word.</li>
            <li>
              The players get 90 seconds to draw and guess the word provided in
              the game.
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <h1 className="text-3xl font-semibold">scoring mechanism</h1>
          <ul className="list-disc px-7 mt-3 text-lg text-yellow-600 tracking-wide">
            <li>
              If a guesser correctly guesses the word, the time remaining in
              that turn is added to their score.
            </li>
            <li>
              The drawer earns points based on the number of correct guesses.
              Each correct guess awards 18 points to the drawer.
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <h1 className="text-3xl font-semibold">
            game continuity and winner determination
          </h1>
          <ul className="list-disc px-7 mt-3 text-lg text-yellow-600 tracking-wide">
            <li>
              The game continues with each player taking turns until all rounds
              are completed.
            </li>
            <li>
              If all but one player leaves the game, the game automatically
              ends.
            </li>
            <li>
              After all rounds are completed, the player with the highest score
              wins.
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <h1 className="text-3xl font-semibold">enjoy and have fun !!</h1>
          <p className="text-lg mt-3 text-yellow-600 tracking-wide">
            GuessSketch is all about creativity, quick thinking, and having a
            blast with friends. Get ready to show off your artistic skills and
            your ability to decipher doodles! Now that you know the basics,
            gather your friends, start a room, and let the guessing begin in
            GuessSketch!
          </p>
        </div>
      </div>
    </div>
  );
}
