import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Code2,
  Computer,
  Gauge,
  Globe2,
  Menu,
  MessageCircleWarning,
  Puzzle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wifi,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type CategoryId = "internet" | "computer" | "phone" | "security" | "apps" | "programming";

type FlowOption = {
  label: string;
  hint: string;
};

type FlowStep = {
  question: string;
  helper: string;
  options: FlowOption[];
};

type TroubleshootingFlow = {
  id: string;
  category: CategoryId;
  title: string;
  description: string;
  solution: string;
  checklist: string[];
  steps: FlowStep[];
};

type Category = {
  id: CategoryId;
  name: string;
  description: string;
  icon: typeof Wifi;
  iconTone: "brand" | "amber" | "mint";
};

const categories: Category[] = [
  { id: "internet", name: "Internet & Wi-Fi", description: "Connected, slow, or won't connect", icon: Wifi, iconTone: "brand" },
  { id: "computer", name: "Computer", description: "Slow, full, or frozen apps", icon: Computer, iconTone: "amber" },
  { id: "phone", name: "Phone", description: "Storage, Bluetooth, crashes", icon: Smartphone, iconTone: "mint" },
  { id: "security", name: "Security & Privacy", description: "Suspicious links and accounts", icon: ShieldCheck, iconTone: "brand" },
  { id: "apps", name: "Apps & Software", description: "Not responding or won't install", icon: Puzzle, iconTone: "amber" },
  { id: "programming", name: "Programming", description: "Errors and code that won't run", icon: Code2, iconTone: "mint" },
];

const yesNo = [
  { label: "Yes", hint: "That sounds right" },
  { label: "No", hint: "Not in my case" },
];

const flow = (
  id: string,
  category: CategoryId,
  title: string,
  description: string,
  solution: string,
  checklist: string[],
  questions: [string, string, string],
): TroubleshootingFlow => ({
  id,
  category,
  title,
  description,
  solution,
  checklist,
  steps: questions.map((question, index) => ({
    question,
    helper:
      index === 0
        ? "A quick check helps us choose the right path."
        : index === 1
          ? "No jargon here — just pick the answer that fits."
          : "One last check before we give you the fix.",
    options: yesNo,
  })),
});

const flows: TroubleshootingFlow[] = [
  flow("wifi-no-internet", "internet", "Wi-Fi is connected but internet isn't working", "Connected to Wi-Fi, but pages and apps won't load.", "Refresh the connection from the network outward.", ["Restart the router and wait 30 seconds.", "Forget the network, then join it again.", "Restart the device and try one trusted website."], ["Does another device have internet?", "Are the router lights showing a normal connection?", "Have you restarted the router recently?"]),
  flow("wifi-wont-connect", "internet", "Wi-Fi won't connect", "Your device can see the network, but it won't join.", "Rebuild the connection cleanly.", ["Move closer to the router.", "Forget the network and join it again.", "Restart both the device and router."], ["Can you see the network in the Wi-Fi list?", "Do other devices connect to this network?", "Have you entered the network password recently?"]),
  flow("internet-slow", "internet", "Internet is very slow", "Everything loads, but it takes much longer than it should.", "Reduce the bottleneck and test again.", ["Pause large downloads and streaming on other devices.", "Restart the router and give it two minutes.", "Run a speed test close to the router."], ["Is the slowdown happening on every device?", "Are downloads or video calls using the connection?", "Does moving closer to the router help?"]),
  flow("computer-slow", "computer", "Computer is running slowly", "Apps take a long time to open or the whole computer feels sluggish.", "Give your computer a clean, lighter start.", ["Close apps and browser tabs you are not using.", "Restart the computer instead of only closing the lid.", "Check for system updates and remove unused startup apps."], ["Is the computer slow right after starting?", "Do you have many apps or tabs open?", "Have you restarted it in the last few days?"]),
  flow("computer-storage", "computer", "Storage is almost full", "There is little room left for files, apps, or updates.", "Free up safe-to-remove space first.", ["Empty the recycle bin or trash.", "Remove downloads and duplicate files you no longer need.", "Move large personal files to a trusted backup location."], ["Is the storage warning appearing repeatedly?", "Do you have large files in Downloads?", "Are your important files backed up?"]),
  flow("computer-app-not-opening", "computer", "Application is not opening", "You click an app, but nothing appears or it closes immediately.", "Start with a clean restart and a fresh app update.", ["Restart the computer.", "Install any pending app or system update.", "Repair or reinstall the app from its official source."], ["Does another app open normally?", "Did the app stop opening after an update?", "Is the app listed in your task manager already?"]),
  flow("phone-storage", "phone", "Phone storage is full", "Your phone warns that there is not enough space.", "Clear temporary clutter without deleting what matters.", ["Review large videos and duplicate photos.", "Remove downloads and apps you no longer use.", "Back up important photos before deleting anything."], ["Are photos or videos using most of the space?", "Do you have unused apps installed?", "Is your important content backed up?"]),
  flow("bluetooth", "phone", "Bluetooth won't connect", "Your phone cannot connect to headphones, a car, or another device.", "Reset the pairing and try from close range.", ["Turn Bluetooth off and on again.", "Forget the accessory and pair it again nearby.", "Charge and restart both devices."], ["Is the accessory visible in the Bluetooth list?", "Is it connected to another device already?", "Are both devices charged and nearby?"]),
  flow("app-crashing", "phone", "App keeps crashing", "An app opens and closes, freezes, or stops responding.", "Refresh the app without risking your personal data.", ["Close the app completely and restart your phone.", "Update the app from the official app store.", "Clear temporary app data or reinstall if needed."], ["Do other apps work normally?", "Is an update waiting for this app?", "Does the issue continue after restarting the phone?"]),
  flow("suspicious-link", "security", "Received a suspicious link", "A link in a message or post feels unexpected or urgent.", "Pause before clicking and verify through a trusted channel.", ["Do not open the link or download anything from it.", "Delete or report the message as spam.", "If you already entered details, change that account password from its official site."], ["Did you expect this message?", "Does the link come from a trusted, familiar source?", "Have you clicked the link already?"]),
  flow("suspicious-message", "security", "Received a suspicious email/message", "A message asks for urgent action, money, or private details.", "Treat the message as untrusted until independently verified.", ["Do not reply or share passwords, OTPs, or codes.", "Contact the supposed sender using a known phone number or website.", "Report and delete the message if it is a scam."], ["Is the request urgent or threatening?", "Is it asking for sensitive information?", "Can you verify it outside the message?"]),
  flow("unknown-app", "security", "Unknown app installed", "You notice an app you do not remember adding.", "Review the app safely before removing it.", ["Do not open the app or grant it new permissions.", "Check its source, permissions, and recent install date.", "Remove it and run your device's security scan if it seems unsafe."], ["Do you recognize the app or its publisher?", "Does it request unusual permissions?", "Did you install it from the official app store?"]),
  flow("password-safety", "security", "Password safety", "You want to make sure your accounts are safer.", "Build safer account habits without sharing any secrets.", ["Use a unique, long password for important accounts.", "Turn on multi-factor authentication where available.", "Review account recovery options and sign-in activity."], ["Do you reuse a password across accounts?", "Is multi-factor authentication available?", "Have you reviewed recent sign-ins?"]),
  flow("app-not-responding", "apps", "App is not responding", "An application is frozen or ignores your clicks.", "Close it safely, then refresh its state.", ["Wait briefly, then close the app from the normal system menu.", "Restart the device and reopen the app.", "Update or repair the app if the issue returns."], ["Is the whole device frozen or only this app?", "Can you close it normally?", "Does the app work after a restart?"]),
  flow("software-install", "apps", "Software installation problem", "An app or program will not install correctly.", "Check the source, space, and system requirements.", ["Use the official download source.", "Check available storage and required permissions.", "Restart and try the latest compatible installer."], ["Is the installer from the official source?", "Do you have enough free storage?", "Does your device meet the app's requirements?"]),
  flow("browser-not-working", "apps", "Browser is not working properly", "Pages are blank, slow, or behaving unexpectedly.", "Refresh the browser environment one layer at a time.", ["Close extra tabs and restart the browser.", "Update the browser and test in a private window.", "Disable unfamiliar extensions and clear temporary data."], ["Does another website load normally?", "Does a private window work?", "Did the issue start after adding an extension?"]),
  flow("python-not-running", "programming", "Python program is not running", "You run a Python file, but it does not start as expected.", "Confirm the interpreter, file, and first error message.", ["Run the file with the intended Python version.", "Read the first error line and check the file path.", "Run a tiny print statement to confirm the environment."], ["Does Python run when you check its version?", "Is the terminal in the folder containing the file?", "Do you see an error message?"]),
  flow("name-error", "programming", "NameError", "Python says a name is not defined.", "Make the name available before the line that uses it.", ["Check spelling and capitalization.", "Define the variable or import before using it.", "Keep names in the same scope as the code that needs them."], ["Is the name spelled exactly the same everywhere?", "Is the variable defined before this line?", "Does the name come from an import?"]),
  flow("syntax-error", "programming", "SyntaxError", "Python cannot understand the structure of a line.", "Check the line and the one immediately before it.", ["Match every bracket, quote, and colon.", "Check indentation and punctuation around the reported line.", "Run the smallest section that still shows the error."], ["Does the line have matching brackets and quotes?", "Does the previous line end correctly?", "Is the indentation consistent?"]),
  flow("index-error", "programming", "IndexError", "Your code asks for a list position that does not exist.", "Check the list length before accessing its position.", ["Print the list and its length.", "Remember that positions start at zero.", "Guard the access so it only runs when the position exists."], ["Could the list be empty?", "Is the index smaller than the list length?", "Are you counting positions from zero?"]),
  flow(
    "account-compromised",
    "security",
    "I think my account may be compromised",
    "You notice unusual sign-ins, messages, or account activity.",
    "Secure the account first, then review recent activity.",
    [
      "Change the account password using the official website or app.",
      "Sign out of unfamiliar devices or sessions.",
      "Turn on multi-factor authentication and review recovery options.",
    ],
    [
      "Can you still access the account?",
      "Do you recognize all recent sign-ins or devices?",
      "Is multi-factor authentication enabled?",
    ],
  ),
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuickFix — Your digital problems, solved step by step" },
      { name: "description", content: "Choose a digital problem and QuickFix will guide you through a clear, practical fix." },
      { property: "og:title", content: "QuickFix — Your digital problems, solved step by step" },
      { property: "og:description", content: "A friendly, private troubleshooter for everyday technology problems." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuickFixHome,
});

function QuickFixHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFlowId, setSelectedFlowId] = useState("wifi-no-internet");
  const [stepIndex, setStepIndex] = useState(1);
  const [solved, setSolved] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const selectedFlow = useMemo(() => flows.find((item) => item.id === selectedFlowId) ?? flows[0], [selectedFlowId]);
  const selectedCategory = categories.find((item) => item.id === selectedFlow.category) ?? categories[0];
  const Icon = selectedCategory.icon;
  const currentStep = selectedFlow.steps[stepIndex];
  const progress = solved ? 100 : ((stepIndex + 1) / selectedFlow.steps.length) * 100;

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  const chooseFlow = (id: string) => {
    setSelectedFlowId(id);
    setStepIndex(0);
    setSolved(false);
    setChooserOpen(false);
    jumpTo("troubleshoot");
  };

  const startFix = () => chooseFlow("wifi-no-internet");

  const answer = () => {
    if (stepIndex < selectedFlow.steps.length - 1) {
      setStepIndex((current) => current + 1);
    } else {
      setSolved(true);
    }
  };

  const tryAnother = () => {
    setSolved(false);
    setStepIndex(0);
    jumpTo("categories");
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/10 bg-paper/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <button className="flex items-center gap-2.5" onClick={() => jumpTo("home")} aria-label="Go to QuickFix home">
            <span className="grid size-9 place-items-center rounded-2xl bg-brand font-display text-base font-bold text-brand-foreground">QF</span>
            <span className="font-display text-lg font-bold tracking-tight">QuickFix</span>
          </button>
          <nav className="hidden items-center gap-1 text-sm font-medium md:flex" aria-label="Primary navigation">
            <Button variant="ghost" className="rounded-full bg-ink text-paper hover:bg-ink/90 hover:text-paper" onClick={() => jumpTo("home")}>Home</Button>
            <Button variant="ghost" className="rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink" onClick={() => jumpTo("categories")}>Categories</Button>
            <Button variant="ghost" className="rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink" onClick={() => jumpTo("how-it-works")}>How It Works</Button>
            <Button variant="ghost" className="rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink" onClick={() => jumpTo("about")}>About</Button>
          </nav>
          <div className="flex items-center gap-2">
            <Button className="rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground ring-1 ring-brand-deep/30 hover:bg-brand-deep" onClick={startFix}>
              <Sparkles className="size-4" /> Find a Fix
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Toggle navigation">
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="border-t border-ink/10 px-5 py-3 md:hidden" aria-label="Mobile navigation">
            <div className="mx-auto grid max-w-6xl gap-1">
              <Button variant="ghost" className="justify-start rounded-xl" onClick={() => jumpTo("home")}>Home</Button>
              <Button variant="ghost" className="justify-start rounded-xl" onClick={() => jumpTo("categories")}>Categories</Button>
              <Button variant="ghost" className="justify-start rounded-xl" onClick={() => jumpTo("how-it-works")}>How It Works</Button>
              <Button variant="ghost" className="justify-start rounded-xl" onClick={() => jumpTo("about")}>About</Button>
            </div>
          </nav>
        )}
      </header>

      <main id="home">
        <section className="pb-16 pt-10 sm:pb-24 sm:pt-14">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:items-start">
            <div className="qf-rise lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-soft px-3 py-1.5 text-xs font-semibold text-ink">
                <span className="size-2 rounded-full bg-brand" /> Guided troubleshooting · no sign-up
              </div>
              <h1 className="mt-5 max-w-[18ch] font-display text-[2.6rem] font-bold leading-[0.95] tracking-tight sm:text-6xl">Your digital problems, solved step by step.</h1>
              <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-ink-muted">Not sure what to do? Choose your problem and QuickFix will guide you through it.</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button className="rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-brand-foreground ring-1 ring-brand-deep/30 hover:bg-brand-deep" onClick={startFix}>Find a Fix <ArrowRight className="size-4" /></Button>
                <Button variant="outline" className="rounded-full border-ink/20 bg-surface px-6 py-3.5 text-base font-semibold text-ink hover:bg-ink/5" onClick={() => { setChooserOpen(true); jumpTo("categories"); }}>I don't know what's wrong</Button>
              </div>
              <div className="mt-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">From confused to fixed</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-3">
                  {["1", "2", "3"].map((number, index) => <span key={number} className={`grid size-9 place-items-center rounded-xl bg-surface font-display text-sm font-bold ring-1 ring-ink/10 ${index === 2 ? "text-ink/70" : index === 1 ? "text-ink/50" : "text-ink/30"}`}>{number}</span>)}
                  <span className="size-1.5 rounded-full bg-brand/70" />
                  <span className="grid size-9 place-items-center rounded-xl bg-brand font-display text-sm font-bold text-brand-foreground">4</span>
                  <span className="size-1.5 rounded-full bg-brand" />
                  <span className="ml-1 text-sm font-semibold text-brand">Fixed</span>
                </div>
              </div>
            </div>

            <div id="troubleshoot" className="qf-rise scroll-mt-6 lg:col-span-7">
              <div className="rounded-[28px] bg-surface p-5 shadow-sm ring-1 ring-ink/10 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-deep"><Icon className="size-3.5" /> {selectedCategory.name}</span>
                  <span className="text-xs font-medium text-ink-muted">{solved ? "Complete" : `Step ${stepIndex + 1} of ${selectedFlow.steps.length}`}</span>
                </div>
                <p className="mt-4 text-sm font-medium text-ink-muted">{selectedFlow.title}</p>
                {solved ? <SolutionPanel flow={selectedFlow} onTryAnother={tryAnother} onSolved={() => setSolved(true)} /> : <>
                  <h2 className="mt-2 max-w-[22ch] font-display text-2xl font-bold leading-tight tracking-tight sm:text-[1.75rem]">{currentStep.question}</h2>
                  <p className="mt-2 text-sm text-ink-muted">{currentStep.helper}</p>
                  <div className="mt-5 flex gap-2" aria-label={`Progress: ${stepIndex + 1} of ${selectedFlow.steps.length}`}>
                    {selectedFlow.steps.map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index <= stepIndex ? "bg-brand qf-bar" : "bg-ink/10"}`} />)}
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {currentStep.options.map((option) => <Button key={option.label} variant="outline" className="group h-auto min-h-[92px] justify-between rounded-2xl border-ink/15 bg-surface p-4 text-left text-ink hover:-translate-y-0.5 hover:border-brand hover:bg-brand-soft" onClick={answer}>
                      <span><span className="block font-display text-lg font-bold">{option.label}</span><span className="mt-1 block text-sm text-ink-muted group-hover:text-brand-deep">{option.hint}</span></span>
                      <span className="grid size-7 place-items-center rounded-full bg-ink/5 text-ink-muted group-hover:bg-brand group-hover:text-brand-foreground"><ChevronRight className="size-4" /></span>
                    </Button>)}
                  </div>
                  <div className="mt-6 rounded-2xl bg-ink/[0.03] p-4 ring-1 ring-ink/5">
                    <div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-mint-soft text-mint"><Gauge className="size-3.5" /></span><span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Your path</span></div>
                    <p className="mt-3 font-display text-base font-bold">{selectedFlow.description}</p>
                    <p className="mt-1.5 text-sm text-ink-muted">Answer the question above to reveal your next step.</p>
                  </div>
                </>}
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="scroll-mt-6 pb-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex items-end justify-between gap-4"><div><h2 className="max-w-[20ch] font-display text-3xl font-bold tracking-tight">What can we help with?</h2><p className="mt-2 text-sm text-ink-muted">Pick a category to start a guided fix.</p></div><span className="hidden text-sm text-ink-muted sm:block">{flows.length} practical fixes</span></div>
            {chooserOpen && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand-soft p-4 text-sm text-brand-deep"><CircleHelp className="mt-0.5 size-5 shrink-0" /><p><strong>Start anywhere.</strong> Choose the area that sounds closest, and we’ll narrow it down with simple questions.</p><Button variant="ghost" size="icon" className="ml-auto -mt-1 shrink-0 rounded-full text-brand-deep" onClick={() => setChooserOpen(false)} aria-label="Close guide"><X className="size-4" /></Button></div>}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {categories.map((category) => { const CategoryIcon = category.icon; const categoryFlows = flows.filter((item) => item.category === category.id); return <button key={category.id} className="group rounded-3xl bg-surface p-5 text-left shadow-sm ring-1 ring-ink/10 transition hover:-translate-y-1 hover:ring-brand/30" onClick={() => chooseFlow(categoryFlows[0].id)}><span className={`grid size-12 place-items-center rounded-2xl ${category.iconTone === "amber" ? "bg-amber-soft text-amber" : category.iconTone === "mint" ? "bg-mint-soft text-mint" : "bg-brand-soft text-brand"}`}><CategoryIcon className="size-6" /></span><span className="mt-4 block font-display text-base font-bold">{category.name}</span><span className="mt-1 block text-sm text-ink-muted">{category.description}</span><span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">{categoryFlows.length} fixes <ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></span></button>; })}
            </div>
            <button className="qf-rise mt-4 flex w-full items-center justify-between gap-4 rounded-3xl bg-ink p-6 text-left text-paper transition hover:-translate-y-1 sm:p-7" onClick={() => { setChooserOpen(true); jumpTo("categories"); }}><span><span className="font-display text-xl font-bold tracking-tight sm:text-2xl">I don't know what's wrong</span><span className="mt-1 block text-sm text-paper/65">Answer a few quick questions and we’ll point you to the right fix.</span></span><span className="grid size-12 shrink-0 place-items-center rounded-full bg-paper/10 text-lg font-bold"><MessageCircleWarning className="size-5" /></span></button>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-6 border-t border-ink/10 py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="rounded-3xl bg-surface p-7 shadow-sm ring-1 ring-ink/10 sm:p-10"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand"><Sparkles className="size-4" /> How it works</div><div className="mt-7 grid gap-8 md:grid-cols-3"><HowStep number="01" title="Choose your problem" text="Pick a category or start with the option that feels closest." /><HowStep number="02" title="Answer simple questions" text="A few clear questions narrow down what to try next." /><HowStep number="03" title="Follow the fix" text="Get a practical checklist and mark it solved when you’re done." /></div></div></div>
        </section>
      </main>

      <footer id="about" className="scroll-mt-6 border-t border-ink/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-center md:justify-between"><div className="max-w-md"><div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-2xl bg-brand font-display text-base font-bold text-brand-foreground">QF</span><span className="font-display text-lg font-bold">QuickFix</span></div><p className="mt-3 text-sm leading-relaxed text-ink-muted">A friendly, private troubleshooter. Everything runs in your browser — no accounts, no passwords, and no data collected.</p></div><div className="flex items-center gap-2 text-sm text-ink-muted"><ShieldCheck className="size-4 text-mint" /> Educational and defensive guidance only.</div></div>
      </footer>
    </div>
  );
}

function SolutionPanel({ flow, onTryAnother, onSolved }: { flow: TroubleshootingFlow; onTryAnother: () => void; onSolved: () => void }) {
  return <div className="mt-6 rounded-2xl bg-ink/[0.03] p-4 ring-1 ring-ink/5"><div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-mint-soft text-mint"><Check className="size-4" /></span><span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Recommended solution</span></div><p className="mt-3 font-display text-lg font-bold">{flow.solution}</p><p className="mt-1.5 text-sm text-ink-muted">Follow this checklist at your own pace.</p><ul className="mt-4 space-y-2.5">{flow.checklist.map((item, index) => <li key={item} className="flex items-start gap-2.5 text-sm text-ink"><span className="grid size-5 shrink-0 place-items-center rounded-md bg-surface text-[10px] font-bold text-brand ring-1 ring-ink/10">{index + 1}</span><span>{item}</span></li>)}</ul><div className="mt-5 flex flex-wrap gap-2.5"><Button className="rounded-full bg-mint px-4 py-2.5 text-sm font-semibold text-brand-foreground ring-1 ring-mint/40 hover:bg-mint/90" onClick={onSolved}><Check className="size-4" /> Problem Solved</Button><Button variant="outline" className="rounded-full border-ink/15 bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5" onClick={onTryAnother}>Try Another Fix</Button></div></div>;
}

function HowStep({ number, title, text }: { number: string; title: string; text: string }) {
  return <div><span className="font-display text-4xl font-bold text-brand/25">{number}</span><h3 className="mt-2 font-display text-lg font-bold">{title}</h3><p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{text}</p></div>;
}