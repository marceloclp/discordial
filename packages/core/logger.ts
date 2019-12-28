import colors from "colors";

const write = (str: string): boolean => process.stdout.write(str);

const pad = (str: any, char: string, length: number, direction: -1 | 1): string => {
  const missing = length - str.toString().length;
  if (missing <= 0) return str;
  return direction
    ? char.repeat(missing) + str.toString()
    : str.toString() + char.repeat(missing);
};

export class Logger {
  private static timestamp(): string {
    const date = new Date();
    const [hours, minutes, seconds] = [
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ].map(v => pad(v, "0", 2, -1));
    return colors.bgCyan(`[${hours}:${minutes}:${seconds}]`);
  }

  private static styledToken(token: string): string {
    return colors.bgYellow.white("[TOKEN]") + " " + colors.yellow(token);
  }

  public static async start(token: string): Promise<void> {
    console.clear();
    write([
      Logger.timestamp(),
      "Discordial",
      colors.bold("@"),
      Logger.styledToken(token) + "\n\n",
    ].join(" "));
  }

  public static async loadingPlugin(name: string, isDynamic: boolean): Promise<void> {
    const type = isDynamic ? "dynamic" : "static";
    write([
      Logger.timestamp(),
      colors.white("Loading"),
      colors.green.bold(name) + colors.magenta.bold(`<${type}>`),
      "...\n",
    ].join(" "));
  }

  public static async loadingInjectable(name: string, scope: string, level = 1): Promise<void> {
    write([
      "   ".repeat(level),
      "↳",
      colors.white("Injecting"),
      colors.yellow.bold(name) + colors.magenta.bold(`<${scope}>`) + "\n",
    ].join(" "));
  }

  public static async bindingPlugin(plugin: string): Promise<void> {
    write([
      Logger.timestamp(),
      colors.white("Binding"),
      colors.green.bold(plugin),
      "...\n",
    ].join(" "));
  }

  public static async bindingMethod(methodName: string, eventName: string): Promise<void> {
    write([
      "   ",
      "↳",
      colors.yellow.bold(methodName),
      "=>",
      colors.blue.italic(eventName) + "\n",
    ].join(" "))
  }

  public static async startLoadingPlugins(): Promise<void> {
    write([
      "\n" + Logger.timestamp(),
      colors.bgRed.white("Loading plugins ...") + "\n",
    ].join(" "));
  }

  public static async startBindingEvents(): Promise<void> {
    write([
      "\n" + Logger.timestamp(),
      colors.bgRed.white("Binding events ...") + "\n",
    ].join(" "));
  }

  public static async connected(): Promise<void> {
    write([
      "\n" + Logger.timestamp(),
      colors.bgGreen.white("Connected successfuly to Discord!") + "\n",
    ].join(" "));
  }

  public static async onEvent(event: string, number: number): Promise<void> {
    write([
      Logger.timestamp(),
      colors.bold.blue(event),
      "=>",
      colors.bold.magenta(number.toString()),
      "method(s) called\n",
    ].join(" "))
  }

  public static async onSuccessfulMethodCall(plugin: string, method: string): Promise<void> {
    write([
      "   ",
      colors.green.bold("✓"),
      colors.yellow.bold(plugin) + `.${method}()\n`,
    ].join(" "));
  }

  public static async onFailedMethodCall(plugin: string, method: string): Promise<void> {
    write([
      "   ",
      colors.red.bold("X"),
      colors.yellow.bold(plugin) + `.${method}()\n`,
    ].join(" "));
  }
};