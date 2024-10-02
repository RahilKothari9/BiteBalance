import Card from '../components/Card.jsx';
import Typography from "@mui/material/Typography";
import TimerIcon from "@mui/icons-material/Timer";
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const Recipe = (props) => {
    let rec = props.recipe
    
    let resultString
    if (rec.startsWith('```json') && rec.endsWith('```')) {
        resultString = rec.substring('```json'.length, rec.length - '```'.length);}
    let recipe = JSON.parse(resultString)
    console.log(recipe)
    const recipeData = {
        title: "Delicious Recipe",
        description: "A tasty dish you'll love!",
        inglist: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
        inslist: ["Step 1: Do something", "Step 2: Do something else", "Step 3: Enjoy!"],
      };
    
    return(
        <div className="bg-secondary-50 relative mx-auto rounded-lg flex  min-h-[95vh] max-w-6xl flex-col items-center">
            <main className="flex-1">
                <div className="">
                    <section className="mx-auto flex max-w-5xl flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
                    <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
                        <Card
                         title={recipe.title}
                         />
                    </h1>
                    {/* <h1>Recipe Name</h1> */}
                    </section>
                    <div className="mx-auto w-full max-w-3xl pb-5">
                        <div className="rounded-lg border w-full">
                            <div className='flex flex-col space-y-1.5 p-6 '>
                            <Card
                             title={recipe.title}
                             description={recipe.description}
                             />
                            </div>
                            <div className='p-6 pt-0 space-y-4 text-sm'>
                                <div className='grid space-y-6 rounded-lg border p-3 md:grid-cols-2 md:space-x-4 md:space-y-0'>
                                    <div className='grid grid-cols-2 gap-4 md:gap-0'>
                                        <div className='col-span-2 mb-2 grid'>
                                            <h2 className='text-lg font-semibold'>Overview</h2>
                                        </div>
                                        <div className='flex gap-2 text-muted-foreground'>
                                            <TimerIcon className="ml-5"></TimerIcon>
                                            <span>
                                            <Typography variant="body1">{recipe.cooking_time} minutes</Typography>
                                            </span>
                                        </div>
                                        <div className='flex gap-2 text-muted-foreground'>
                                            <StarIcon className="ml-5"></StarIcon>
                                            <span>
                                            <Typography variant="body1">{recipe.difficulty}</Typography>
                                            </span>
                                        </div>
                                        <div className='flex gap-2 text-muted-foreground'>
                                            <PeopleIcon className="ml-5"></PeopleIcon>
                                            <span>
                                            <Typography variant="body1">{(recipe.people)?recipe.people:"2 Serving"}</Typography>
                                            </span>
                                        </div>
                                        <div className='flex gap-2 text-muted-foreground'>
                                            <WhatshotIcon className="ml-5"></WhatshotIcon>
                                            <span>
                                            <Typography variant="body1">{recipe.calories}</Typography>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className='p-6 space-y-2'>
                             <h1 className='text-lg font-semibold'>Ingredients</h1>
                             <Card
                             inglist={recipe.ingredients}
                             />
                            </div>
                            <div className='p-6 space-y-2 '>
                                <h1 className='text-lg font-semibold'>Instructions</h1>
                                <Card
                                inslist={recipe.instructions}
                                />
                            </div>
                            <div className=' flex items-center p-6 pt-0'>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )

}


export default Recipe;

